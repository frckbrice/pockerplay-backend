import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  // id: number;
  // @IsNotEmpty()
  @IsString()
  winner: string;

  @IsOptional()
  @IsString()
  player2_id: string;

  @IsNumber()
  @IsOptional()
  away_score: number;

  @IsNumber()
  @IsOptional()
  home_score: number;

  @IsNumber()
  @IsOptional()
  number_of_round: number;
}
