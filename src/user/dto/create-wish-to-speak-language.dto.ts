import { Language } from '@prisma/client';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWishToSpeakLanguageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  language!: Language;
}
