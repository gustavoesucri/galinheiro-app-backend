import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGalpoeDto } from './dto/create-galpoe.dto';
import { UpdateGalpoeDto } from './dto/update-galpoe.dto';
import { Galpao } from './entities/galpoes.entity';

@Injectable()
export class GalpoesService {
  constructor(
    @InjectRepository(Galpao)
    private galpaoRepository: Repository<Galpao>,
  ) {}

  async create(createGalpoeDto: CreateGalpoeDto) {
    // RN-001: Nome único
    const existente = await this.galpaoRepository.findOne({
      where: { nome: createGalpoeDto.nome },
    });
    if (existente) {
      throw new BadRequestException('Já existe um galpão com este nome');
    }

    // RN-002: Densidade mínima (0.5m²/galinha)
    const densidade =
      createGalpoeDto.area_m2 / createGalpoeDto.capacidade_maxima_galinhas;
    if (densidade < 0.5) {
      throw new BadRequestException(
        `Densidade muito alta: ${densidade.toFixed(2)}m²/galinha. Mínimo: 0.5m²/galinha`,
      );
    }

    // RN-003: Data de manutenção não pode ser futura
    if (createGalpoeDto.data_ultima_manutencao > new Date()) {
      throw new BadRequestException('Data de manutenção não pode ser futura');
    }

    const galpao = this.galpaoRepository.create(createGalpoeDto);
    return this.galpaoRepository.save(galpao);
  }

  async findAll() {
    return this.galpaoRepository.find({
      relations: ['ninhos', 'galinhas', 'medicoes'],
    });
  }

  async findOne(id: string) {
    const galpao = await this.galpaoRepository.findOne({
      where: { id },
      relations: ['ninhos', 'galinhas', 'medicoes'],
    });
    if (!galpao) {
      throw new NotFoundException(`Galpão com ID ${id} não encontrado`);
    }
    return galpao;
  }

  async update(id: string, updateGalpoeDto: UpdateGalpoeDto) {
    const galpao = await this.findOne(id);

    // RN-001: Nome único (se está mudando o nome)
    if (updateGalpoeDto.nome && updateGalpoeDto.nome !== galpao.nome) {
      const existente = await this.galpaoRepository.findOne({
        where: { nome: updateGalpoeDto.nome },
      });
      if (existente) {
        throw new BadRequestException('Já existe um galpão com este nome');
      }
    }

    // RN-002: Densidade mínima
    const area = updateGalpoeDto.area_m2 || galpao.area_m2;
    const capacidade =
      updateGalpoeDto.capacidade_maxima_galinhas ||
      galpao.capacidade_maxima_galinhas;
    const densidade = area / capacidade;
    if (densidade < 0.5) {
      throw new BadRequestException(
        `Densidade muito alta: ${densidade.toFixed(2)}m²/galinha. Mínimo: 0.5m²/galinha`,
      );
    }

    // RN-003: Data de manutenção não pode ser futura
    if (
      updateGalpoeDto.data_ultima_manutencao &&
      updateGalpoeDto.data_ultima_manutencao > new Date()
    ) {
      throw new BadRequestException('Data de manutenção não pode ser futura');
    }

    await this.galpaoRepository.update(id, updateGalpoeDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const galpao = await this.findOne(id);
    return this.galpaoRepository.remove(galpao);
  }
}
