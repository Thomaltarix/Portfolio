import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { DEFAULT_LANGUAGE, useSiteLanguage } from '@/lib/use-site-language';
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n, t } = useTranslation('common');
  const currentLanguage = useSiteLanguage();
  const nextLanguage = SUPPORTED_LANGUAGES.find((language) => language !== currentLanguage) ?? DEFAULT_LANGUAGE;

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
