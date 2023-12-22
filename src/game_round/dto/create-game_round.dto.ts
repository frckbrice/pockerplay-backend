import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGameRoundDto {
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  gamesession_id: string;

  @IsNumber()
  @IsNotEmpty()
  round_number: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  number_of_proposals: number;
}
