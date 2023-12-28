import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  // @IsEmail()
  // @IsNotEmpty()
  // email?: string;

  // @IsString()
  // @IsNotEmpty()
  // image?: string;

  // @IsNumber()
  // @IsNotEmpty()
  // badge?: number;
}
