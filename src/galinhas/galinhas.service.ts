import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGalinhaDto } from './dto/create-galinha.dto';
import { UpdateGalinhaDto } from './dto/update-galinha.dto';
import { Galinha } from './entities/galinha.entity';
import { Galpao } from '../galpoes/entities/galpoes.entity';

@Injectable()
export class GalinhasService {
  constructor(
    @InjectRepository(Galinha)
    private galinhaRepository: Repository<Galinha>,
  ) {}

  async create(createGalinhaDto: CreateGalinhaDto) {
    // RN-004: Galinha em quarentena não pode ter galpão ou ninho
    if (createGalinhaDto.emQuarentena) {
      if (createGalinhaDto.galpaoId || createGalinhaDto.ninhoId) {
        throw new BadRequestException(
          'Galinha em quarentena não pode estar vinculada a galpão ou ninho',
        );
      }
    }

    // RN-005: Data de nascimento não pode ser futura
    if (createGalinhaDto.data_nascimento > new Date()) {
      throw new BadRequestException('Data de nascimento não pode ser futura');
    }

    // RN-006: Verificar capacidade do galpão se informado
    if (createGalinhaDto.galpaoId) {
      const galpao = await this.galinhaRepository.manager.findOne(Galpao, {
        where: { id: createGalinhaDto.galpaoId },
      });
      if (!galpao) {
        throw new NotFoundException('Galpão não encontrado');
      }

      const galinhasNoGalpao = await this.galinhaRepository.count({
        where: { galpaoId: createGalinhaDto.galpaoId },
      });

      if (galinhasNoGalpao >= galpao.capacidade_maxima_galinhas) {
        throw new BadRequestException(
          `Galpão atingiu capacidade máxima de ${galpao.capacidade_maxima_galinhas} galinhas`,
        );
      }
    }

    const galinha = this.galinhaRepository.create(createGalinhaDto);
    return this.galinhaRepository.save(galinha);
  }

  async findAll() {
    return this.galinhaRepository.find({
      relations: ['galpao', 'ninho', 'ovos'],
    });
  }

  async findOne(id: string) {
    const galinha = await this.galinhaRepository.findOne({
      where: { id },
      relations: ['galpao', 'ninho', 'ovos'],
    });
    if (!galinha) {
      throw new NotFoundException(`Galinha com ID ${id} não encontrada`);
    }
    return galinha;
  }

  async update(id: string, updateGalinhaDto: UpdateGalinhaDto) {
    const galinha = await this.findOne(id);

    // RN-004: Galinha em quarentena não pode ter galpão ou ninho
    if (updateGalinhaDto.emQuarentena) {
      if (updateGalinhaDto.galpaoId || updateGalinhaDto.ninhoId) {
        throw new BadRequestException(
          'Galinha em quarentena não pode estar vinculada a galpão ou ninho',
        );
      }
    }

    // RN-005: Data de nascimento não pode ser futura
    if (
      updateGalinhaDto.data_nascimento &&
      updateGalinhaDto.data_nascimento > new Date()
    ) {
      throw new BadRequestException('Data de nascimento não pode ser futura');
    }

    // RN-006: Verificar capacidade do galpão se está mudando
    if (
      updateGalinhaDto.galpaoId &&
      updateGalinhaDto.galpaoId !== galinha.galpaoId
    ) {
      const galpao = await this.galinhaRepository.manager.findOne(Galpao, {
        where: { id: updateGalinhaDto.galpaoId },
      });
      if (!galpao) {
        throw new NotFoundException('Galpão não encontrado');
      }

      const galinhasNoGalpao = await this.galinhaRepository.count({
        where: { galpaoId: updateGalinhaDto.galpaoId },
      });

      if (galinhasNoGalpao >= galpao.capacidade_maxima_galinhas) {
        throw new BadRequestException(
          `Galpão atingiu capacidade máxima de ${galpao.capacidade_maxima_galinhas} galinhas`,
        );
      }
    }

    await this.galinhaRepository.update(id, updateGalinhaDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const galinha = await this.findOne(id);
    return this.galinhaRepository.remove(galinha);
  }
}
