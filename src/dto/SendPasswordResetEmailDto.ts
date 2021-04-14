import { IsEmail, MinLength } from 'class-validator';

class SendPasswordResetEmailDto {
  @MinLength(1)
  @IsEmail()
  email!: string;
}

export default SendPasswordResetEmailDto;
