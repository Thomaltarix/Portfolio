import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="h-px w-4 bg-accent" aria-hidden="true" />
          {t('brand')}
        </Link>

        <nav className="hidden items-stretch md:flex">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2 px-4 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground',
                index > 0 && 'border-l border-border',
              )}
            >
              {t(link.labelKey)}
              {'comingSoon' in link && link.comingSoon && <Badge>{t('comingSoon')}</Badge>}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CommandPalette />
          <ResumeMenu />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 24px)',
        }}
        aria-hidden="true"
      />
    </header>
  );
}
