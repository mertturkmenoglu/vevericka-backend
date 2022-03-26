/* eslint-disable indent */

import { Language, Proficiency } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSpeakingLanguageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  language!: Language;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  proficiency!: Proficiency;
}
