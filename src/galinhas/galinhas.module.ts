import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalinhasService } from './galinhas.service';
import { GalinhasController } from './galinhas.controller';
import { Galinha } from './entities/galinha.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Galinha])],
  controllers: [GalinhasController],
  providers: [GalinhasService],
  exports: [TypeOrmModule],
})
export class GalinhasModule {}
