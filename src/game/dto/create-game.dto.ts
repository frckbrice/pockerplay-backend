import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  home_player_id: string;

  @IsOptional()
  @IsString()
  guess_player_id?: string;

  @IsString()
  @IsOptional()
  winner?: string;

  @IsNumber()
  @IsOptional()
  home_player_score?: number;

  @IsNumber()
  @IsOptional()
  guess_player_score?: number;

  // @IsNumber()
  // @IsOptional()
  // number_of_rounds?: number;
}
