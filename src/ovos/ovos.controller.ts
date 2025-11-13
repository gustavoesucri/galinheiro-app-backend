import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OvosService } from './ovos.service';
import { CreateOvoDto } from './dto/create-ovo.dto';
import { UpdateOvoDto } from './dto/update-ovo.dto';

@Controller('ovos')
export class OvosController {
  constructor(private readonly ovosService: OvosService) {}

  @Post()
  create(@Body() createOvoDto: CreateOvoDto) {
    return this.ovosService.create(createOvoDto);
  }

  @Get()
  findAll() {
    return this.ovosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ovosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOvoDto: UpdateOvoDto) {
    return this.ovosService.update(id, updateOvoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ovosService.remove(id);
  }
}
