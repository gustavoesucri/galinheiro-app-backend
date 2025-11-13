import {
  IsString,
  IsEnum,
  IsDate,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmptyToNull } from '../../common/transformers/empty-to-null.transformer';

export class CreateOvoDto {
  @IsDate()
  @Type(() => Date)
  data: Date;

  @EmptyToNull({ trim: true })
  @IsOptional()
  @IsUUID()
  galinhaId?: string;

  @EmptyToNull({ trim: true })
  @IsOptional()
  @IsUUID()
  ninhoId?: string;

  @IsEnum(['Pequeno', 'Médio', 'Grande', 'Extra'])
  tamanho: string;

  @IsEnum(['Branco', 'Marrom', 'Azul', 'Verde'])
  cor: string;

  @IsEnum(['Boa', 'Quebrado', 'Defeituoso'])
  qualidade: string;

  @EmptyToNull()
  @IsOptional()
  @IsString()
  observacoes?: string;
}
