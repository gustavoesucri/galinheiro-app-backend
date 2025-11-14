import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GalinhasService } from './galinhas.service';
import { CreateGalinhaDto } from './dto/create-galinha.dto';
import { UpdateGalinhaDto } from './dto/update-galinha.dto';

@ApiTags('galinhas')
@Controller('galinhas')
export class GalinhasController {
  constructor(private readonly galinhasService: GalinhasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova galinha' })
  @ApiBody({
    type: CreateGalinhaDto,
    examples: {
      minimal: {
        summary: 'Minimal (apenas campos obrigatórios)',
        value: {
          nome: 'Margarida',
          saude: 'Boa',
          local: 'galpao',
          data_nascimento: '2020-05-01'
        }
      },
      full: {
        summary: 'Completo (todos os campos)',
        value: {
          nome: 'Margarida',
          saude: 'Boa',
          raca: 'Leghorn',
          emQuarentena: false,
          local: 'galpao',
          galpaoId: '123e4567-e89b-12d3-a456-426614174000',
          ninhoId: null,
          data_nascimento: '2020-05-01'
        }
      },
      invalid: {
        summary: 'Inválido (exemplo para testar validação)',
        value: {
          nome: '',
          saude: 'MuitoMal',
          local: 'desconhecido',
          data_nascimento: 'not-a-date'
        }
      }
    }
  })
  create(@Body() createGalinhaDto: CreateGalinhaDto) {
    return this.galinhasService.create(createGalinhaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as galinhas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de galinhas retornada com sucesso',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          nome: 'Margarida',
          saude: 'Boa',
          raca: 'Leghorn',
          emQuarentena: false,
          local: 'galpao',
          galpaoId: null,
          ninhoId: null,
          data_nascimento: '2020-05-01'
        }
      ]
    }
  })
  findAll() {
    return this.galinhasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma galinha por ID' })
  @ApiParam({ name: 'id', description: 'ID da galinha' })
  @ApiResponse({
    status: 200,
    description: 'Galinha encontrada',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nome: 'Margarida',
        saude: 'Boa',
        raca: 'Leghorn',
        emQuarentena: false,
        local: 'galpao',
        galpaoId: null,
        ninhoId: null,
        data_nascimento: '2020-05-01'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Galinha não encontrada' })
  findOne(@Param('id') id: string) {
    return this.galinhasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma galinha (parcial)' })
  @ApiBody({
    type: UpdateGalinhaDto,
    examples: {
      minimal: {
        summary: 'Atualização mínima',
        value: {
          nome: 'Margarida 2'
        }
      },
      full: {
        summary: 'Atualização completa',
        value: {
          nome: 'Margarida Atualizada',
          saude: 'Fragilizada',
          raca: 'Rhode Island',
          emQuarentena: true,
          local: 'quarentena'
        }
      },
      invalid: {
        summary: 'Inválido',
        value: {
          saude: 'Desconhecido'
        }
      }
    }
  })
  update(@Param('id') id: string, @Body() updateGalinhaDto: UpdateGalinhaDto) {
    return this.galinhasService.update(id, updateGalinhaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma galinha' })
  @ApiParam({ name: 'id', description: 'ID da galinha' })
  @ApiResponse({ status: 200, description: 'Galinha removida com sucesso', schema: { example: { deleted: true } } })
  @ApiResponse({ status: 404, description: 'Galinha não encontrada' })
  remove(@Param('id') id: string) {
    return this.galinhasService.remove(id);
  }
}
