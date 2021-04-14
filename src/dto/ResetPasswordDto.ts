import { IsEmail, MinLength } from 'class-validator';

class ResetPasswordDto {
  @MinLength(1)
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @MinLength(1)
  code!: string;
}

export default ResetPasswordDto;
