import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  round_id: string;

  @IsString()
  @IsNotEmpty()
  proposals: string[];
}
