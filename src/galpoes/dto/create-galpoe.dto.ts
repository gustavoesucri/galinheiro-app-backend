import {
  IsString,
  IsInt,
  IsEnum,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGalpoeDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsInt()
  @Min(1)
  capacidade_maxima_galinhas: number;

  @IsInt()
  @Min(1)
  capacidade_maxima_ninhos: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  numero_ninhos_ocupados?: number;

  @IsNumber()
  @Min(1)
  area_m2: number;

  @IsEnum(['terra', 'concreto', 'serragem'])
  tipo_piso: string;

  @IsEnum(['natural', 'forçada', 'exaustão'])
  ventilacao: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @IsDate()
  @Type(() => Date)
  data_ultima_manutencao: Date;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
