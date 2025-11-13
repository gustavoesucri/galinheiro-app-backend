import { PartialType } from '@nestjs/mapped-types';
import { CreateNinhoDto } from './create-ninho.dto';

export class UpdateNinhoDto extends PartialType(CreateNinhoDto) {}
