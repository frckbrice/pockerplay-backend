import { PartialType } from '@nestjs/mapped-types';
import { CreateGuessDto } from './create-guess.dto';
import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateGuessDto extends PartialType(CreateGuessDto) {
  @IsOptional()
  @IsString()
  home_player_id?: string;

  @IsOptional()
  @IsString()
  guess_player_id?: string;

  @IsOptional()
  @IsString()
  home_player_guess?: string;

  @IsOptional()
  @IsString()
  guess_player_guess?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isCorrect: boolean;

  @IsNotEmpty()
  @IsString()
  choice_id: string;
}
