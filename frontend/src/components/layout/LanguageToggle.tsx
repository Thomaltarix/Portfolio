import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = (i18n.resolvedLanguage ?? 'en') as SupportedLanguage;
  const nextLanguage = SUPPORTED_LANGUAGES.find((language) => language !== currentLanguage) ?? 'en';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => i18n.changeLanguage(nextLanguage)}
      aria-label={t('language.switchTo', { language: t(`language.${nextLanguage}`) })}
    >
      {t(`language.${currentLanguage}`)}
    </Button>
  );
}
