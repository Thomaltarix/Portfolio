import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from './i18n';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// i18next can report a regional or unsupported tag (e.g. "fr-FR"), so normalise it
// to one of the languages the site actually ships.
export function useSiteLanguage(): SupportedLanguage {
  const { i18n } = useTranslation();
  const resolvedLanguage = i18n.resolvedLanguage ?? DEFAULT_LANGUAGE;
  return SUPPORTED_LANGUAGES.find((language) => language === resolvedLanguage) ?? DEFAULT_LANGUAGE;
}
