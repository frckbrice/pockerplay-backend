import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGuessDto {
  @IsNotEmpty()
  @IsString()
  home_player_id?: string;

  @IsNotEmpty()
  @IsString()
  guess_player_id?: string;

  @IsNotEmpty()
  @IsString()
  home_player_guess?: string;

  @IsNotEmpty()
  @IsString()
  guess_player_guess?: string;

  @IsNotEmpty()
  @IsString()
  role?: string;

  @IsNotEmpty()
  @IsString()
  choice_id: string;

  @IsOptional()
  @IsBoolean()
  isCorrect: boolean;
}
