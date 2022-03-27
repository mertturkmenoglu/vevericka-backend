import { LanguageKey } from './language-key.enum';
import { LanguageName } from './language-name.enum';

export const languages: Record<LanguageKey, LanguageName> = {
  AR: LanguageName.ARABIC,
  CS: LanguageName.CZECH,
  DE: LanguageName.GERMAN,
  EL: LanguageName.GREEK,
  EN: LanguageName.ENGLISH,
  ES: LanguageName.SPANISH,
  FR: LanguageName.FRENCH,
  HU: LanguageName.HUNGARIAN,
  ID: LanguageName.INDONESIAN,
  IT: LanguageName.ITALIAN,
  JA: LanguageName.JAPANESE,
  KO: LanguageName.KOREAN,
  KU: LanguageName.KURDISH,
  NL: LanguageName.DUTCH,
  PL: LanguageName.POLISH,
  PT: LanguageName.PORTUGUESE,
  RO: LanguageName.ROMANIAN,
  RU: LanguageName.RUSSIAN,
  TR: LanguageName.TURKISH,
  ZH: LanguageName.CHINESE,
};
