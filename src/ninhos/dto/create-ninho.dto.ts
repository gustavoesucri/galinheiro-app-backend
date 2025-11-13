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

export class CreateNinhoDto {
  @IsString()
  @MaxLength(100)
  identificacao: string;

  @IsEnum(['Palha', 'Serragem', 'Plástico'])
  tipo_material: string;

  @IsUUID()
  galpaoId: string;

  @IsBoolean()
  @IsOptional()
  ocupado?: boolean;

  @EmptyToNull()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ultima_limpeza?: Date;

  @EmptyToNull({ trim: true })
  @IsOptional()
  @IsUUID()
  galinhaId?: string;

  @EmptyToNull()
  @IsOptional()
  @IsString()
  observacoes?: string;
}
