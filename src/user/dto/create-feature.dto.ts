import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  feature!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;
}
