import { IsLowercase, MaxLength, IsEmail, MinLength } from 'class-validator';

class RegisterDto {
  @MaxLength(32)
  @IsLowercase()
  username!: string;

  @MaxLength(255)
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @MinLength(1)
  name!: string;
}

export default RegisterDto;
