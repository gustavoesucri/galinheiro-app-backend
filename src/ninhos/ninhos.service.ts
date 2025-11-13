import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNinhoDto } from './dto/create-ninho.dto';
import { UpdateNinhoDto } from './dto/update-ninho.dto';
import { Ninho } from './entities/ninho.entity';
import { Galpao } from '../galpoes/entities/galpoes.entity';

@Injectable()
export class NinhosService {
  constructor(
    @InjectRepository(Ninho)
    private ninhoRepository: Repository<Ninho>,
  ) {}

  async create(createNinhoDto: CreateNinhoDto) {
    // RN-008: Verificar se galpão existe
    const galpao = await this.ninhoRepository.manager.findOne(Galpao, {
      where: { id: createNinhoDto.galpaoId },
    });
    if (!galpao) {
      throw new NotFoundException('Galpão não encontrado');
    }

    // RN-009: Ninhos ocupados não pode exceder capacidade do galpão
    const ninhosNoGalpao = await this.ninhoRepository.count({
      where: { galpaoId: createNinhoDto.galpaoId },
    });

    if (ninhosNoGalpao >= galpao.capacidade_maxima_ninhos) {
      throw new BadRequestException(
        `Galpão atingiu capacidade máxima de ${galpao.capacidade_maxima_ninhos} ninhos`,
      );
    }

    // RN-010: Data de limpeza não pode ser futura
    if (
      createNinhoDto.ultima_limpeza &&
      createNinhoDto.ultima_limpeza > new Date()
    ) {
      throw new BadRequestException('Data de limpeza não pode ser futura');
    }

    const ninho = this.ninhoRepository.create(createNinhoDto);
    return this.ninhoRepository.save(ninho);
  }

  async findAll() {
    return this.ninhoRepository.find({
      relations: ['galpao', 'galinhas', 'ovos'],
    });
  }

  async findOne(id: string) {
    const ninho = await this.ninhoRepository.findOne({
      where: { id },
      relations: ['galpao', 'galinhas', 'ovos'],
    });
    if (!ninho) {
      throw new NotFoundException(`Ninho com ID ${id} não encontrado`);
    }
    return ninho;
  }

  async update(id: string, updateNinhoDto: UpdateNinhoDto) {
    const ninho = await this.findOne(id);

    // RN-008: Verificar se galpão existe (se está mudando)
    if (updateNinhoDto.galpaoId && updateNinhoDto.galpaoId !== ninho.galpaoId) {
      const galpao = await this.ninhoRepository.manager.findOne(Galpao, {
        where: { id: updateNinhoDto.galpaoId },
      });
      if (!galpao) {
        throw new NotFoundException('Galpão não encontrado');
      }

      // RN-009: Verificar capacidade do novo galpão
      const ninhosNoGalpao = await this.ninhoRepository.count({
        where: { galpaoId: updateNinhoDto.galpaoId },
      });

      if (ninhosNoGalpao >= galpao.capacidade_maxima_ninhos) {
        throw new BadRequestException(
          `Galpão atingiu capacidade máxima de ${galpao.capacidade_maxima_ninhos} ninhos`,
        );
      }
    }

    // RN-010: Data de limpeza não pode ser futura
    if (
      updateNinhoDto.ultima_limpeza &&
      updateNinhoDto.ultima_limpeza > new Date()
    ) {
      throw new BadRequestException('Data de limpeza não pode ser futura');
    }

    await this.ninhoRepository.update(id, updateNinhoDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const ninho = await this.findOne(id);
    return this.ninhoRepository.remove(ninho);
  }
}
