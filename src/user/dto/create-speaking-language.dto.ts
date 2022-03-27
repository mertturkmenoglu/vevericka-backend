import { Language, Proficiency } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSpeakingLanguageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @IsEnum(Language)
  language!: Language;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsEnum(Proficiency)
  proficiency!: Proficiency;
}
