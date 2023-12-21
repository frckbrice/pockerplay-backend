import { PartialType } from '@nestjs/mapped-types';
import { CreateGameRoundDto } from './create-game_round.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGameRoundDto extends PartialType(CreateGameRoundDto) {
  @IsNumber()
  @IsOptional()
  roundNumber: string;
}
