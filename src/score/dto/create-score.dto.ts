import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScoreDto {
  @IsNotEmpty()
  @IsString()
  home_player_score?: string;

  @IsNotEmpty()
  @IsString()
  guess_player_score?: string;

  @IsNotEmpty()
  @IsString()
  round_id: string;
}
