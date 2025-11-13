import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GalpoesModule } from './galpoes/galpoes.module';
import { GalinhasModule } from './galinhas/galinhas.module';
import { NinhosModule } from './ninhos/ninhos.module';
import { OvosModule } from './ovos/ovos.module';
import { MedicoesAmbienteModule } from './medicoes-ambiente/medicoes-ambiente.module';
import { dataSourceOptions } from './data-source';
import { DashboardController } from './dashboard/dashboard.controller';
import { Galpao } from './galpoes/entities/galpoes.entity';
import { Galinha } from './galinhas/entities/galinha.entity';
import { Ninho } from './ninhos/entities/ninho.entity';
import { Ovo } from './ovos/entities/ovo.entity';
import { MedicoesAmbiente } from './medicoes-ambiente/entities/medicoes-ambiente.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Galpao, Galinha, Ninho, Ovo, MedicoesAmbiente]),
    GalpoesModule,
    GalinhasModule,
    NinhosModule,
    OvosModule,
    MedicoesAmbienteModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService],
})
export class AppModule {}
