import {
  IsString,
  IsEnum,
  IsBoolean,
  IsDate,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNinhoDto {
  @IsString()
  @MaxLength(100)
  identificacao: string;

  @IsEnum(['madeira', 'plástico', 'palha'])
  tipo_material: string;

  @IsUUID()
  galpaoId: string;

  @IsBoolean()
  @IsOptional()
  ocupado?: boolean;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  ultima_limpeza?: Date;

  @IsUUID()
  @IsOptional()
  galinhaId?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
