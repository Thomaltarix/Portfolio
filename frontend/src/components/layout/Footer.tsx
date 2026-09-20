import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-8 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <nav aria-label={t('footer.legalNavigation')} className="flex items-center gap-4">
          <Link to="/mentions-legales" className="hover:text-foreground">
            {t('footer.legalNotice')}
          </Link>
          <Link to="/confidentialite" className="hover:text-foreground">
            {t('footer.privacy')}
          </Link>
          <a href="#top" className="hover:text-foreground">
            {t('footer.backToTop')}
          </a>
        </nav>
      </div>
    </footer>
  );
}
