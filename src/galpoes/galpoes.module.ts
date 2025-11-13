import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalpoesService } from './galpoes.service';
import { GalpoesController } from './galpoes.controller';
import { Galpao } from './entities/galpoes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Galpao])],
  controllers: [GalpoesController],
  providers: [GalpoesService],
  exports: [TypeOrmModule],
})
export class GalpoesModule {}
