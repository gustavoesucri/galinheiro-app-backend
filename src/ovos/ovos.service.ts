import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateOvoDto } from './dto/create-ovo.dto';
import { UpdateOvoDto } from './dto/update-ovo.dto';
import { Ovo } from './entities/ovo.entity';
import { Galinha } from '../galinhas/entities/galinha.entity';

@Injectable()
export class OvosService {
  constructor(
    @InjectRepository(Ovo)
    private ovoRepository: Repository<Ovo>,
  ) {}

  async create(createOvoDto: CreateOvoDto) {
    // RN-013: Data de coleta não pode ser futura
    if (createOvoDto.data > new Date()) {
      throw new BadRequestException('Data de coleta não pode ser futura');
    }

    // RN-011: Máximo 2 ovos por galinha por dia (se galinha conhecida)
    if (createOvoDto.galinhaId) {
      const iniciodia = new Date(createOvoDto.data);
      iniciodia.setHours(0, 0, 0, 0);
      const fimDia = new Date(createOvoDto.data);
      fimDia.setHours(23, 59, 59, 999);

      const ovosHoje = await this.ovoRepository.count({
        where: {
          galinhaId: createOvoDto.galinhaId,
          data: Between(iniciodia, fimDia),
        },
      });

      if (ovosHoje >= 2) {
        throw new BadRequestException(
          'Galinha já atingiu o limite de 2 ovos por dia',
        );
      }

      // RN-007: Galinha deve ter idade mínima de 120 dias para postura
      const galinha = await this.ovoRepository.manager.findOne(Galinha, {
        where: { id: createOvoDto.galinhaId },
      });

      if (galinha) {
        const dataNascimento = new Date(galinha.data_nascimento);
        const idadeEmDias = Math.floor(
          (createOvoDto.data.getTime() - dataNascimento.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (idadeEmDias < 120) {
          throw new BadRequestException(
            `Galinha muito jovem para postura. Idade: ${idadeEmDias} dias. Mínimo: 120 dias`,
          );
        }
      }
    }

    const ovo = this.ovoRepository.create(createOvoDto);
    const ovoSalvo = await this.ovoRepository.save(ovo);
    return this.findOne(ovoSalvo.id);
  }

  async findAll() {
    return this.ovoRepository.find({
      relations: ['galinha', 'ninho'],
    });
  }

  async findOne(id: string) {
    const ovo = await this.ovoRepository.findOne({
      where: { id },
      relations: ['galinha', 'ninho'],
    });
    if (!ovo) {
      throw new NotFoundException(`Ovo com ID ${id} não encontrado`);
    }
    return ovo;
  }

  async update(id: string, updateOvoDto: UpdateOvoDto) {
    const ovo = await this.findOne(id);

    // RN-014: Data de coleta é imutável
    if (updateOvoDto.data) {
      const dataOvoExistente = new Date(ovo.data);
      if (updateOvoDto.data.getTime() !== dataOvoExistente.getTime()) {
        throw new BadRequestException('Data de coleta não pode ser alterada');
      }
    }

    // RN-013: Data de coleta não pode ser futura
    if (updateOvoDto.data && updateOvoDto.data > new Date()) {
      throw new BadRequestException('Data de coleta não pode ser futura');
    }

    await this.ovoRepository.update(id, updateOvoDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const ovo = await this.findOne(id);
    return this.ovoRepository.remove(ovo);
  }
}
