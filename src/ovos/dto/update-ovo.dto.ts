import { PartialType } from '@nestjs/mapped-types';
import { CreateOvoDto } from './create-ovo.dto';

export class UpdateOvoDto extends PartialType(CreateOvoDto) {}
