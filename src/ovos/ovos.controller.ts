import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OvosService } from './ovos.service';
import { CreateOvoDto } from './dto/create-ovo.dto';
import { UpdateOvoDto } from './dto/update-ovo.dto';

@ApiTags('ovos')
@Controller('ovos')
export class OvosController {
  constructor(private readonly ovosService: OvosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um novo ovo' })
  @ApiBody({
    type: CreateOvoDto,
    examples: {
      default: {
        summary: 'Exemplo de ovo',
        value: {
          data: '2024-11-13',
          galinhaId: '123e4567-e89b-12d3-a456-426614174000',
          ninhoId: null,
          tamanho: 'Médio',
          cor: 'Marrom',
          qualidade: 'Boa',
          observacoes: 'Ovo com casca fina'
        }
      }
    }
  })
  create(@Body() createOvoDto: CreateOvoDto) {
    return this.ovosService.create(createOvoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os ovos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ovos retornada com sucesso',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          data: '2024-11-13',
          galinhaId: '123e4567-e89b-12d3-a456-426614174000',
          ninhoId: null,
          tamanho: 'Médio',
          cor: 'Marrom',
          qualidade: 'Boa'
        }
      ]
    }
  })
  findAll() {
    return this.ovosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um ovo por ID' })
  @ApiParam({ name: 'id', description: 'ID do ovo' })
  @ApiResponse({
    status: 200,
    description: 'Ovo encontrado',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        data: '2024-11-13',
        galinhaId: '123e4567-e89b-12d3-a456-426614174000',
        ninhoId: null,
        tamanho: 'Médio',
        cor: 'Marrom',
        qualidade: 'Boa'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Ovo não encontrado' })
  findOne(@Param('id') id: string) {
    return this.ovosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um ovo' })
  @ApiParam({ name: 'id', description: 'ID do ovo' })
  @ApiBody({
    type: UpdateOvoDto,
    examples: {
      default: {
        summary: 'Exemplo de atualização',
        value: {
          qualidade: 'Quebrado',
          observacoes: 'Ovo quebrado ao abrir'
        }
      }
    }
  })
  update(@Param('id') id: string, @Body() updateOvoDto: UpdateOvoDto) {
    return this.ovosService.update(id, updateOvoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um ovo' })
  @ApiParam({ name: 'id', description: 'ID do ovo' })
  @ApiResponse({ status: 200, description: 'Ovo removido com sucesso', schema: { example: { deleted: true } } })
  @ApiResponse({ status: 404, description: 'Ovo não encontrado' })
  remove(@Param('id') id: string) {
    return this.ovosService.remove(id);
  }
}
