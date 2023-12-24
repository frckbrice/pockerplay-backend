import { PartialType } from '@nestjs/mapped-types';
import { CreateScoreDto } from './create-score.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateScoreDto extends PartialType(CreateScoreDto) {
  @IsNotEmpty()
  @IsString()
  home_player_score?: string;

  @IsNotEmpty()
  @IsString()
  guess_player_score?: string;

  @IsNotEmpty()
  @IsString()
  round_id?: string;
}
