import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';
import { ResumeMenu } from './ResumeMenu';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '#about', labelKey: 'nav.about' },
  { href: '#experience', labelKey: 'nav.experience' },
  { href: '#projects', labelKey: 'nav.projects', comingSoon: true },
  { href: '#playground', labelKey: 'nav.playground', comingSoon: true },
  { href: '#contact', labelKey: 'nav.contact' },
] as const;

export function Header() {
  const { t } = useTranslation('common');

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="text-sm font-semibold tracking-tight">
          {t('brand')}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(link.labelKey)}
              {'comingSoon' in link && link.comingSoon && <Badge>{t('comingSoon')}</Badge>}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ResumeMenu />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
