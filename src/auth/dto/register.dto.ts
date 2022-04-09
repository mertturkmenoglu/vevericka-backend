import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsLowercase,
  MaxLength,
  IsEmail,
  MinLength,
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @MaxLength(32)
  @IsNotEmpty()
  @IsLowercase()
  @IsString()
  @Matches(/^(?=.{6,32}$)(?![_])(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_])$/)
  username!: string;

  @MaxLength(255)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email address', example: 'user@test.com' })
  email!: string;

  @MaxLength(256)
  @IsNotEmpty()
  @IsString()
  password!: string;

  @MaxLength(64)
  @IsString()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  image: string = 'profile.png';

  @MinLength(6)
  @MaxLength(6)
  @IsNotEmpty()
  @IsString()
  betaCode!: string;
}
