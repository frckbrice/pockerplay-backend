import { PartialType } from '@nestjs/mapped-types';
import { CreateChoiceDto } from './create-choice.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChoiceDto extends PartialType(CreateChoiceDto) {
  @IsNotEmpty()
  @IsString()
  choice_made: string;
}
