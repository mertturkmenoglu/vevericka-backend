import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsLowercase, MaxLength, IsEmail, MinLength, IsString, IsNotEmpty } from 'class-validator';
import { UserConstraints } from '../../user/user.entity';

export class RegisterDto {
  @MaxLength(UserConstraints.username.max)
  @MinLength(UserConstraints.username.min)
  @IsNotEmpty()
  @IsLowercase()
  @IsString()
  username!: string;

  @MaxLength(UserConstraints.email.max)
  @MinLength(UserConstraints.email.min)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email address', example: 'user@test.com' })
  email!: string;

  @MinLength(UserConstraints.password.min)
  @MaxLength(UserConstraints.password.max)
  @IsNotEmpty()
  @IsString()
  password!: string;

  @MinLength(UserConstraints.name.min)
  @MaxLength(UserConstraints.name.max)
  @IsString()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  image: string = 'profile.png';
}
