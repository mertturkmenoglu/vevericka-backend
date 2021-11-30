import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MinLength(1)
  email!: string;

  @MinLength(8)
  password!: string;
}
