import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NinhosService } from './ninhos.service';
import { NinhosController } from './ninhos.controller';
import { Ninho } from './entities/ninho.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ninho])],
  controllers: [NinhosController],
  providers: [NinhosService],
  exports: [TypeOrmModule],
})
export class NinhosModule {}
