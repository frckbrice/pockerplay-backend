import { PartialType } from '@nestjs/mapped-types';
import { CreateGameRoundDto } from './create-game_round.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGameRoundDto extends PartialType(CreateGameRoundDto) {
  @IsString()
  @IsOptional()
  category: string;

  @IsNumber()
  @IsOptional()
  number_of_proposals: number;

  @IsNumber()
  @IsOptional()
  round_number: number;

  @IsString()
  @IsOptional()
  gamesession_id: string;
}
