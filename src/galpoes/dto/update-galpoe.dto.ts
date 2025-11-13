import { PartialType } from '@nestjs/mapped-types';
import { CreateGalpoeDto } from './create-galpoe.dto';

export class UpdateGalpoeDto extends PartialType(CreateGalpoeDto) {}
