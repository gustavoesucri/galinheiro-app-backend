import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OvosService } from './ovos.service';
import { OvosController } from './ovos.controller';
import { Ovo } from './entities/ovo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ovo])],
  controllers: [OvosController],
  providers: [OvosService],
  exports: [TypeOrmModule],
})
export class OvosModule {}
