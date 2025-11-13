import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NinhosService } from './ninhos.service';
import { CreateNinhoDto } from './dto/create-ninho.dto';
import { UpdateNinhoDto } from './dto/update-ninho.dto';

@Controller('ninhos')
export class NinhosController {
  constructor(private readonly ninhosService: NinhosService) {}

  @Post()
  create(@Body() createNinhoDto: CreateNinhoDto) {
    return this.ninhosService.create(createNinhoDto);
  }

  @Get()
  findAll() {
    return this.ninhosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ninhosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNinhoDto: UpdateNinhoDto) {
    return this.ninhosService.update(id, updateNinhoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ninhosService.remove(id);
  }
}
