import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicoesAmbienteDto } from './create-medicoes-ambiente.dto';

export class UpdateMedicoesAmbienteDto extends PartialType(CreateMedicoesAmbienteDto) {}
