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
import { EmptyToNull } from '../../common/transformers/empty-to-null.transformer';

export class CreateGalinhaDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsEnum(['Boa', 'Fragilizada', 'Adoecida'])
  saude: string;

  @EmptyToNull()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  raca?: string;

  @IsBoolean()
  @IsOptional()
  emQuarentena?: boolean;

  @IsEnum(['galpao', 'campo', 'quarentena'])
  local: string;

  @EmptyToNull({ trim: true })
  @IsOptional()
  @IsUUID()
  galpaoId?: string;

  @EmptyToNull({ trim: true })
  @IsOptional()
  @IsUUID()
  ninhoId?: string;

  @IsDate()
  @Type(() => Date)
  data_nascimento: Date;
}
