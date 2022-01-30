export type ContentfulLocale = 'en-US' | 'tr';

export type ApiLocale = 'en' | 'tr' | 'es';

export const mapApiToContentfulLocale: Record<ApiLocale, ContentfulLocale> = {
  en: 'en-US',
  tr: 'tr',
  es: 'en-US',
};
