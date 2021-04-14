import { IsEnum } from 'class-validator';
import { Language as LanguageEnum } from '../types/LanguageEnum';
import { Proficiency } from '../types/ProficiencyEnum';

class Language {
  @IsEnum(LanguageEnum)
  language!: LanguageEnum;

  @IsEnum(Proficiency)
  proficiency!: Proficiency;
}

export default Language;
