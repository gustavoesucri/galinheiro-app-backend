import {
  IsUUID,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDate,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicoesAmbienteDto {
  @IsUUID()
  galpaoId: string;

  @IsNumber()
  @Min(-10)
  @Max(60)
  temperatura: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  umidade: number;

  @IsInt()
  @Min(0)
  @Max(100000)
  luminosidade: number;

  @IsBoolean()
  @IsOptional()
  usa_ventilacao?: boolean;

  @IsBoolean()
  @IsOptional()
  ventilacao_ativa?: boolean;

  @IsDate()
  @Type(() => Date)
  data_medicao: Date;
}
