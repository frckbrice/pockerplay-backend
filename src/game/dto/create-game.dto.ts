import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  player1_id: string;

  @IsOptional()
  @IsString()
  player2_id: string;

  @IsString()
  @IsOptional()
  winner: string;

  @IsNumber()
  @IsOptional()
  away_score: number;

  @IsNumber()
  @IsOptional()
  home_score: number;

  @IsNumber()
  @IsOptional()
  number_of_rounds: number;
}
