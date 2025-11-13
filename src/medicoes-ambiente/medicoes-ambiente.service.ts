import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMedicoesAmbienteDto } from './dto/create-medicoes-ambiente.dto';
import { UpdateMedicoesAmbienteDto } from './dto/update-medicoes-ambiente.dto';
import { MedicoesAmbiente } from './entities/medicoes-ambiente.entity';

@Injectable()
export class MedicoesAmbienteService {
  constructor(
    @InjectRepository(MedicoesAmbiente)
    private medicaoRepository: Repository<MedicoesAmbiente>,
  ) {}

  async create(createMedicoesAmbienteDto: CreateMedicoesAmbienteDto) {
    // RN-015: Temperatura deve estar entre -10 e 60°C (validado no DTO também)
    if (
      createMedicoesAmbienteDto.temperatura < -10 ||
      createMedicoesAmbienteDto.temperatura > 60
    ) {
      throw new BadRequestException('Temperatura deve estar entre -10°C e 60°C');
    }

    // RN-016: Umidade deve estar entre 0 e 100% (validado no DTO também)
    if (
      createMedicoesAmbienteDto.umidade < 0 ||
      createMedicoesAmbienteDto.umidade > 100
    ) {
      throw new BadRequestException('Umidade deve estar entre 0% e 100%');
    }

    // RN-017: Data de medição não pode ser futura
    if (createMedicoesAmbienteDto.data_medicao > new Date()) {
      throw new BadRequestException('Data de medição não pode ser futura');
    }

    const medicao = this.medicaoRepository.create(createMedicoesAmbienteDto);
    return this.medicaoRepository.save(medicao);
  }

  async findAll() {
    return this.medicaoRepository.find({
      relations: ['galpao'],
    });
  }

  async findOne(id: string) {
    const medicao = await this.medicaoRepository.findOne({
      where: { id },
      relations: ['galpao'],
    });
    if (!medicao) {
      throw new NotFoundException(`Medição com ID ${id} não encontrada`);
    }
    return medicao;
  }

  async update(id: string, updateMedicoesAmbienteDto: UpdateMedicoesAmbienteDto) {
    await this.findOne(id);

    // RN-015: Temperatura deve estar entre -10 e 60°C
    if (
      updateMedicoesAmbienteDto.temperatura !== undefined &&
      (updateMedicoesAmbienteDto.temperatura < -10 ||
        updateMedicoesAmbienteDto.temperatura > 60)
    ) {
      throw new BadRequestException('Temperatura deve estar entre -10°C e 60°C');
    }

    // RN-016: Umidade deve estar entre 0 e 100%
    if (
      updateMedicoesAmbienteDto.umidade !== undefined &&
      (updateMedicoesAmbienteDto.umidade < 0 ||
        updateMedicoesAmbienteDto.umidade > 100)
    ) {
      throw new BadRequestException('Umidade deve estar entre 0% e 100%');
    }

    // RN-017: Data de medição não pode ser futura
    if (
      updateMedicoesAmbienteDto.data_medicao &&
      updateMedicoesAmbienteDto.data_medicao > new Date()
    ) {
      throw new BadRequestException('Data de medição não pode ser futura');
    }

    await this.medicaoRepository.update(id, updateMedicoesAmbienteDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const medicao = await this.findOne(id);
    return this.medicaoRepository.remove(medicao);
  }
}
