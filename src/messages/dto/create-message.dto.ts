import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  sender_id: string;

  @IsString()
  @IsNotEmpty()
  receiver_id: string;

  @IsString()
  @IsNotEmpty()
  round_id: string;
}
