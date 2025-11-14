import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GalpoesService } from './galpoes.service';
import { CreateGalpoeDto } from './dto/create-galpoe.dto';
import { UpdateGalpoeDto } from './dto/update-galpoe.dto';

@ApiTags('galpoes')
@Controller('galpoes')
export class GalpoesController {
  constructor(private readonly galpoesService: GalpoesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo galpão' })
  @ApiBody({
    type: CreateGalpoeDto,
    examples: {
      minimal: {
        summary: 'Minimal (obrigatórios)',
        value: {
          nome: 'Galpão',
          capacidade_maxima_galinhas: 10,
          capacidade_maxima_ninhos: 5,
          area_m2: 50,
          tipo_piso: 'terra',
          ventilacao: 'natural',
          data_ultima_manutencao: '2024-11-01'
        }
      },
      full: {
        summary: 'Completo',
        value: {
          nome: 'Galpão Principal',
          capacidade_maxima_galinhas: 100,
          capacidade_maxima_ninhos: 50,
          numero_ninhos_ocupados: 25,
          area_m2: 200.5,
          tipo_piso: 'concreto',
          ventilacao: 'natural',
          ativo: true,
          data_ultima_manutencao: '2024-11-01',
          observacoes: 'Recém reformado'
        }
      },
      invalid: {
        summary: 'Inválido',
        value: {
          nome: '',
          capacidade_maxima_galinhas: 0,
          area_m2: -10,
          tipo_piso: 'chao'
        }
      }
    }
  })
  create(@Body() createGalpoeDto: CreateGalpoeDto) {
    return this.galpoesService.create(createGalpoeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os galpões' })
  @ApiResponse({
    status: 200,
    description: 'Lista de galpões retornada com sucesso',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          nome: 'Galpão Principal',
          capacidade_maxima_galinhas: 100,
          capacidade_maxima_ninhos: 50,
          numero_ninhos_ocupados: 25,
          area_m2: 200.5,
          tipo_piso: 'concreto',
          ventilacao: 'natural',
          ativo: true,
          data_ultima_manutencao: '2024-11-01'
        }
      ]
    }
  })
  findAll() {
    return this.galpoesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um galpão por ID' })
  @ApiParam({ name: 'id', description: 'ID do galpão' })
  @ApiResponse({
    status: 200,
    description: 'Galpão encontrado',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Galpão Principal',
        capacidade_maxima_galinhas: 100,
        capacidade_maxima_ninhos: 50,
        numero_ninhos_ocupados: 25,
        area_m2: 200.5,
        tipo_piso: 'concreto',
        ventilacao: 'natural',
        ativo: true,
        data_ultima_manutencao: '2024-11-01'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Galpão não encontrado' })
  findOne(@Param('id') id: string) {
    return this.galpoesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um galpão' })
  @ApiParam({ name: 'id', description: 'ID do galpão' })
  @ApiBody({
    type: UpdateGalpoeDto,
    examples: {
      minimal: {
        summary: 'Atualização mínima',
        value: {
          nome: 'Galpão X'
        }
      },
      full: {
        summary: 'Atualização completa',
        value: {
          nome: 'Galpão Atualizado',
          capacidade_maxima_galinhas: 120,
          ativo: false
        }
      },
      invalid: {
        summary: 'Inválido',
        value: {
          capacidade_maxima_galinhas: -5
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Galpão atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Galpão não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  update(@Param('id') id: string, @Body() updateGalpoeDto: UpdateGalpoeDto) {
    return this.galpoesService.update(id, updateGalpoeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um galpão' })
  @ApiParam({ name: 'id', description: 'ID do galpão' })
  @ApiResponse({ status: 200, description: 'Galpão removido com sucesso', schema: { example: { deleted: true } } })
  @ApiResponse({ status: 404, description: 'Galpão não encontrado' })
  remove(@Param('id') id: string) {
    return this.galpoesService.remove(id);
  }
}
