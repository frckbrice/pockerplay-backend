import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChoiceDto {
  @IsNotEmpty()
  @IsString()
  player_id: string;

  @IsNotEmpty()
  @IsString()
  option_id: string;

  @IsNotEmpty()
  @IsString()
  choice_made: string;
}
