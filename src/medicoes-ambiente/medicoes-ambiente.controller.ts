import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MedicoesAmbienteService } from './medicoes-ambiente.service';
import { CreateMedicoesAmbienteDto } from './dto/create-medicoes-ambiente.dto';
import { UpdateMedicoesAmbienteDto } from './dto/update-medicoes-ambiente.dto';

@ApiTags('medicoes-ambiente')
@Controller('medicoes-ambiente')
export class MedicoesAmbienteController {
  constructor(private readonly medicoesAmbienteService: MedicoesAmbienteService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar uma nova medição de ambiente' })
  @ApiBody({
    type: CreateMedicoesAmbienteDto,
    examples: {
      default: {
        summary: 'Exemplo de medição',
        value: {
          galpaoId: '123e4567-e89b-12d3-a456-426614174000',
          temperatura: 25.5,
          umidade: 65.0,
          luminosidade: 50000,
          usa_ventilacao: true,
          ventilacao_ativa: false,
          data_medicao: '2024-11-13T10:30:00Z'
        }
      }
    }
  })
  create(@Body() createMedicoesAmbienteDto: CreateMedicoesAmbienteDto) {
    return this.medicoesAmbienteService.create(createMedicoesAmbienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as medições de ambiente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de medições retornada com sucesso',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          galpaoId: '123e4567-e89b-12d3-a456-426614174000',
          temperatura: 25.5,
          umidade: 65.0,
          luminosidade: 50000,
          usa_ventilacao: true,
          ventilacao_ativa: false,
          data_medicao: '2024-11-13T10:30:00Z'
        }
      ]
    }
  })
  findAll() {
    return this.medicoesAmbienteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma medição por ID' })
  @ApiParam({ name: 'id', description: 'ID da medição' })
  @ApiResponse({
    status: 200,
    description: 'Medição encontrada',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        galpaoId: '123e4567-e89b-12d3-a456-426614174000',
        temperatura: 25.5,
        umidade: 65.0,
        luminosidade: 50000,
        usa_ventilacao: true,
        ventilacao_ativa: false,
        data_medicao: '2024-11-13T10:30:00Z'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Medição não encontrada' })
  findOne(@Param('id') id: string) {
    return this.medicoesAmbienteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma medição de ambiente' })
  @ApiParam({ name: 'id', description: 'ID da medição' })
  @ApiBody({
    type: UpdateMedicoesAmbienteDto,
    examples: {
      default: {
        summary: 'Exemplo de atualização',
        value: {
          temperatura: 22.0,
          umidade: 60.0,
          ventilacao_ativa: true
        }
      }
    }
  })
  update(@Param('id') id: string, @Body() updateMedicoesAmbienteDto: UpdateMedicoesAmbienteDto) {
    return this.medicoesAmbienteService.update(id, updateMedicoesAmbienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma medição' })
  @ApiParam({ name: 'id', description: 'ID da medição' })
  @ApiResponse({ status: 200, description: 'Medição removida com sucesso', schema: { example: { deleted: true } } })
  @ApiResponse({ status: 404, description: 'Medição não encontrada' })
  remove(@Param('id') id: string) {
    return this.medicoesAmbienteService.remove(id);
  }
}
