import { PartialType } from '@nestjs/mapped-types';
import { CreateGuessDto } from './create-guess.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateGuessDto extends PartialType(CreateGuessDto) {
  @IsOptional()
  @IsString()
  guessed_image: string;

  @IsOptional()
  @IsString()
  opponent_choice: string;

  @IsOptional()
  @IsBoolean()
  isCorrect: boolean;
}
