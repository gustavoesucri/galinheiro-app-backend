import {
  IsString,
  IsEnum,
  IsDate,
  IsUUID,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOvoDto {
  @IsDate()
  @Type(() => Date)
  data: Date;

  @IsUUID()
  @IsOptional()
  galinhaId?: string;

  @IsUUID()
  @IsOptional()
  ninhoId?: string;

  @IsEnum(['Pequeno', 'Médio', 'Grande'])
  tamanho: string;

  @IsEnum(['Branco', 'Marrom', 'Verde'])
  cor: string;

  @IsEnum(['Boa', 'Rachado', 'Sujo'])
  qualidade: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
