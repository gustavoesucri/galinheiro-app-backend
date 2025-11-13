import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoesAmbienteService } from './medicoes-ambiente.service';
import { MedicoesAmbienteController } from './medicoes-ambiente.controller';
import { MedicoesAmbiente } from './entities/medicoes-ambiente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoesAmbiente])],
  controllers: [MedicoesAmbienteController],
  providers: [MedicoesAmbienteService],
  exports: [TypeOrmModule],
})
export class MedicoesAmbienteModule {}
