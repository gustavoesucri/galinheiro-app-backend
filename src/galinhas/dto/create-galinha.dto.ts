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

export class CreateGalinhaDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsEnum(['Boa', 'Fragilizada', 'Adoecida'])
  saude: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  raca?: string;

  @IsBoolean()
  @IsOptional()
  emQuarentena?: boolean;

  @IsEnum(['galpao', 'campo', 'quarentena'])
  local: string;

  @IsUUID()
  @IsOptional()
  galpaoId?: string;

  @IsUUID()
  @IsOptional()
  ninhoId?: string;

  @IsDate()
  @Type(() => Date)
  data_nascimento: Date;
}
