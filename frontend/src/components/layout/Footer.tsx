import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <a href="#top" className="hover:text-foreground">
          {t('footer.backToTop')}
        </a>
      </div>
    </footer>
  );
}
