import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicoesAmbienteService } from './medicoes-ambiente.service';
import { CreateMedicoesAmbienteDto } from './dto/create-medicoes-ambiente.dto';
import { UpdateMedicoesAmbienteDto } from './dto/update-medicoes-ambiente.dto';

@Controller('medicoes-ambiente')
export class MedicoesAmbienteController {
  constructor(private readonly medicoesAmbienteService: MedicoesAmbienteService) {}

  @Post()
  create(@Body() createMedicoesAmbienteDto: CreateMedicoesAmbienteDto) {
    return this.medicoesAmbienteService.create(createMedicoesAmbienteDto);
  }

  @Get()
  findAll() {
    return this.medicoesAmbienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicoesAmbienteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicoesAmbienteDto: UpdateMedicoesAmbienteDto) {
    return this.medicoesAmbienteService.update(id, updateMedicoesAmbienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicoesAmbienteService.remove(id);
  }
}
