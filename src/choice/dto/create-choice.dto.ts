import { IsString } from 'class-validator';

export class CreateChoiceDto {
  @IsString()
  id?: string;

  @IsString()
  round_id?: string;

  @IsString()
  home_player_id?: string;

  @IsString()
  guess_player_id?: string;

  @IsString()
  home_player_choice?: string;

  @IsString()
  guess_player_choice?: string;

  @IsString()
  proposals: string;

  @IsString()
  home_message_hint?: string;

  @IsString()
  guess_message_hint?: string;
}
