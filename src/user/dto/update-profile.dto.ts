import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @IsOptional()
  @IsUrl()
  image?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsOptional()
  job?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsOptional()
  twitterHandle?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsOptional()
  school?: string;

  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  @IsUrl()
  website?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  @IsOptional()
  @IsUrl()
  bannerImage?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsOptional()
  city?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsOptional()
  country?: string;
}
