import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  round_id: string;

  @IsString()
  @IsNotEmpty()
  round_number: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  number_of_proposals: number;
}
