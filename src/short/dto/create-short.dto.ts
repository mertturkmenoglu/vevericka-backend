import { IsLowercase, MaxLength, MinLength, IsString, IsNotEmpty } from 'class-validator';

export class CreateShortDto {
  @MaxLength(32)
  @IsNotEmpty()
  @IsLowercase()
  @IsString()
  username!: string;

  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  @IsString()
  url!: string;
}
