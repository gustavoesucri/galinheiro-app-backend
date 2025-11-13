import { PartialType } from '@nestjs/mapped-types';
import { CreateGalinhaDto } from './create-galinha.dto';

export class UpdateGalinhaDto extends PartialType(CreateGalinhaDto) {}
