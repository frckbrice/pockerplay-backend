import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGameRoundDto {
  @IsString()
  @IsNotEmpty()
  gamesession: string;

  @IsNumber()
  @IsNotEmpty()
  roundNumber: string;
}
