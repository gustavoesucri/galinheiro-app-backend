import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GalinhasService } from './galinhas.service';
import { CreateGalinhaDto } from './dto/create-galinha.dto';
import { UpdateGalinhaDto } from './dto/update-galinha.dto';

@Controller('galinhas')
export class GalinhasController {
  constructor(private readonly galinhasService: GalinhasService) {}

  @Post()
  create(@Body() createGalinhaDto: CreateGalinhaDto) {
    return this.galinhasService.create(createGalinhaDto);
  }

  @Get()
  findAll() {
    return this.galinhasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galinhasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalinhaDto: UpdateGalinhaDto) {
    return this.galinhasService.update(id, updateGalinhaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galinhasService.remove(id);
  }
}
