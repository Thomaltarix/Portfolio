import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';
import { ResumeMenu } from './ResumeMenu';
import { ThemeToggle } from './ThemeToggle';
import { useActiveSection } from './use-active-section';

const NAV_LINKS = [
  { id: 'about', labelKey: 'nav.about' },
  { id: 'experience', labelKey: 'nav.experience' },
  { id: 'projects', labelKey: 'nav.projects' },
  { id: 'playground', labelKey: 'nav.playground', comingSoon: true },
  { id: 'contact', labelKey: 'nav.contact' },
] as const;

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

// The wrapper ignores pointer events so the empty gutters around the pill never
// block clicks on the page behind it; only the pill itself is interactive.
export function Header() {
  const { t } = useTranslation('common');
  const activeId = useActiveSection(SECTION_IDS);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <header className="pointer-events-none sticky top-0 z-50 px-4 pt-4">
      <div className="pointer-events-auto relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border border-border bg-background/85 pl-6 pr-2 backdrop-blur-md">
        <Link to="/" className="text-sm font-semibold tracking-tight">
          {t('brand')}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.id === activeId;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'relative isolate flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors duration-150',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground [@media(hover:hover)]:hover:text-foreground',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-section"
                    className="absolute inset-0 -z-10 rounded-full bg-surface"
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0 }}
                  />
                )}
                {t(link.labelKey)}
                {'comingSoon' in link && link.comingSoon && (
                  <Badge className="hidden xl:inline-flex">{t('comingSoon')}</Badge>
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <CommandPalette />
          <ResumeMenu />
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* Reading progress: an accent line that draws along the pill's bottom edge. */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="pointer-events-none absolute inset-x-8 -bottom-px h-px origin-left bg-accent"
        />
      </div>
    </header>
  );
}
