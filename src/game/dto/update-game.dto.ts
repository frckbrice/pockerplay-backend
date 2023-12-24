import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  // id: number;
  @IsOptional()
  @IsString()
  winner?: string;

  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  guess_player_id?: string;

  @IsNumber()
  @IsOptional()
  guess_player_score?: number;

  @IsNumber()
  @IsOptional()
  home_player_score?: number;

  // @IsNumber()
  // @IsOptional()
  // number_of_round?: number;
}
