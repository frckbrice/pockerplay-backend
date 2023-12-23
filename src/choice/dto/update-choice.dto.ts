import { PartialType } from '@nestjs/mapped-types';
import { CreateChoiceDto } from './create-choice.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateChoiceDto extends PartialType(CreateChoiceDto) {
  @IsOptional()
  @IsString()
  home_player_id?: string;

  @IsOptional()
  @IsString()
  guess_player_id?: string;

  @IsOptional()
  @IsString()
  home_player_choice?: string;

  @IsOptional()
  @IsString()
  guess_player_choice?: string;

  @IsOptional()
  @IsString()
  proposals: string;

  @IsOptional()
  @IsString()
  home_message_hint?: string;

  @IsOptional()
  @IsString()
  guess_message_hint?: string;
}
