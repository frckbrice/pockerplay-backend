import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGuessDto {
  @IsNotEmpty()
  @IsString()
  guessing_user: string;

  @IsNotEmpty()
  @IsString()
  option_id: string;

  @IsNotEmpty()
  @IsString()
  guessed_image: string;

  @IsNotEmpty()
  @IsString()
  opponent_choice: string;

  @IsOptional()
  @IsBoolean()
  isCorrect: boolean;
}
