import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionDto } from './create-option.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOptionDto extends PartialType(CreateOptionDto) {
  @IsString()
  @IsNotEmpty()
  proposals: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  round_number: number;
}
