import { IsEmail, IsString } from 'class-validator';

export class CreateUser {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
