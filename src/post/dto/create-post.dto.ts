/* eslint-disable indent */
import { IsLowercase, MaxLength, MinLength, IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @MaxLength(32)
  @IsNotEmpty()
  @IsLowercase()
  @IsString()
  username!: string;

  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  content!: string;
}
