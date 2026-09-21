import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-6 font-mono text-xs sm:py-8 text-muted-foreground sm:flex-row sm:justify-between">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <nav aria-label={t('footer.legalNavigation')} className="flex flex-wrap items-center justify-center gap-x-5">
          <Link to="/mentions-legales" className="inline-block py-3.5 hover:text-foreground">
            {t('footer.legalNotice')}
          </Link>
          <Link to="/confidentialite" className="inline-block py-3.5 hover:text-foreground">
            {t('footer.privacy')}
          </Link>
          <a href="#top" className="inline-block py-3.5 hover:text-foreground">
            {t('footer.backToTop')}
          </a>
        </nav>
      </div>
    </footer>
  );
}
