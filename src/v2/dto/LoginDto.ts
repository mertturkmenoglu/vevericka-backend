import { IsEmail, MinLength } from 'class-validator';

class LoginDto {
  @IsEmail()
  @MinLength(1)
  email!: string;

  @MinLength(8)
  password!: string;
}

export default LoginDto;
