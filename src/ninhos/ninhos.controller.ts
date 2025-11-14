import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NinhosService } from './ninhos.service';
import { CreateNinhoDto } from './dto/create-ninho.dto';
import { UpdateNinhoDto } from './dto/update-ninho.dto';

@ApiTags('ninhos')
@Controller('ninhos')
export class NinhosController {
  constructor(private readonly ninhosService: NinhosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo ninho' })
  @ApiBody({
    type: CreateNinhoDto,
    examples: {
      minimal: {
        summary: 'Minimal',
        value: {
          identificacao: 'Ninho A1',
          tipo_material: 'Palha',
          galpaoId: '123e4567-e89b-12d3-a456-426614174000'
        }
      },
      full: {
        summary: 'Completo',
        value: {
          identificacao: 'Ninho A1',
          tipo_material: 'Palha',
          galpaoId: '123e4567-e89b-12d3-a456-426614174000',
          ocupado: false,
          ultima_limpeza: '2024-11-10',
          galinhaId: null,
          observacoes: 'Recém limpo'
        }
      },
      invalid: {
        summary: 'Inválido',
        value: {
          identificacao: '',
          tipo_material: 'Madeira'
        }
      }
    }
  })
  create(@Body() createNinhoDto: CreateNinhoDto) {
    return this.ninhosService.create(createNinhoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ninhos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ninhos retornada com sucesso',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          identificacao: 'Ninho A1',
          tipo_material: 'Palha',
          galpaoId: '123e4567-e89b-12d3-a456-426614174000',
          ocupado: false,
          ultima_limpeza: '2024-11-10'
        }
      ]
    }
  })
  findAll() {
    return this.ninhosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um ninho por ID' })
  @ApiParam({ name: 'id', description: 'ID do ninho' })
  @ApiResponse({
    status: 200,
    description: 'Ninho encontrado',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        identificacao: 'Ninho A1',
        tipo_material: 'Palha',
        galpaoId: '123e4567-e89b-12d3-a456-426614174000',
        ocupado: false,
        ultima_limpeza: '2024-11-10'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Ninho não encontrado' })
  findOne(@Param('id') id: string) {
    return this.ninhosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um ninho' })
  @ApiParam({ name: 'id', description: 'ID do ninho' })
    @ApiBody({
      type: UpdateNinhoDto,
      examples: {
        minimal: {
          summary: 'Minimal update',
          value: {
            identificacao: 'Ninho A1 atualizado'
          }
        },
        full: {
          summary: 'Full update',
          value: {
            identificacao: 'Ninho A1 atualizado',
            ocupado: true,
            ultima_limpeza: '2024-11-12',
            galinhaId: '123e4567-e89b-12d3-a456-426614174001',
            observacoes: 'Agora está ocupado'
          }
        },
        invalid: {
          summary: 'Invalid update',
          value: {
            identificacao: '',
            ocupado: 'not-a-boolean'
          }
        }
      }
  })
  update(@Param('id') id: string, @Body() updateNinhoDto: UpdateNinhoDto) {
    return this.ninhosService.update(id, updateNinhoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um ninho' })
  @ApiParam({ name: 'id', description: 'ID do ninho' })
  @ApiResponse({ status: 200, description: 'Ninho removido com sucesso', schema: { example: { deleted: true } } })
  @ApiResponse({ status: 404, description: 'Ninho não encontrado' })
  remove(@Param('id') id: string) {
    return this.ninhosService.remove(id);
  }
}
