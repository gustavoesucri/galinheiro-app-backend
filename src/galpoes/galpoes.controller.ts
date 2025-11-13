import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GalpoesService } from './galpoes.service';
import { CreateGalpoeDto } from './dto/create-galpoe.dto';
import { UpdateGalpoeDto } from './dto/update-galpoe.dto';

@Controller('galpoes')
export class GalpoesController {
  constructor(private readonly galpoesService: GalpoesService) {}

  @Post()
  create(@Body() createGalpoeDto: CreateGalpoeDto) {
    return this.galpoesService.create(createGalpoeDto);
  }

  @Get()
  findAll() {
    return this.galpoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galpoesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalpoeDto: UpdateGalpoeDto) {
    return this.galpoesService.update(id, updateGalpoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galpoesService.remove(id);
  }
}
