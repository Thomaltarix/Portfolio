import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { LanguageToggle } from './LanguageToggle';
import { RESUME_FILES } from './resume-files';
import { ThemeToggle } from './ThemeToggle';

export interface MobileMenuLink {
  readonly id: string;
  readonly labelKey: string;
  readonly comingSoon?: boolean;
}

interface MobileMenuProps {
  readonly links: readonly MobileMenuLink[];
  readonly activeId: string | null;
}

const MENU_ID = 'mobile-menu';

// Below the lg breakpoint the header pill has no room for the section links and the
// four utility controls, so they move into a sheet that opens under the pill.
export function MobileMenu({ links, activeId }: MobileMenuProps) {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="contents lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={MENU_ID}
        aria-label={isOpen ? t('mobileMenu.close') : t('mobileMenu.open')}
        onClick={() => setIsOpen((open) => !open)}
        className="grid size-11 place-items-center rounded-full text-foreground transition-colors duration-150 active:bg-surface"
      >
        {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={MENU_ID}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-lg border border-border bg-background p-2"
          >
            <nav aria-label={t('mobileMenu.navigation')}>
              <ul>
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setIsOpen(false)}
                      aria-current={link.id === activeId ? 'location' : undefined}
                      className={cn(
                        'flex min-h-14 items-center justify-between rounded-md px-4 text-lg font-medium transition-colors duration-150 active:bg-surface',
                        link.id === activeId ? 'text-accent' : 'text-foreground',
                      )}
                    >
                      {t(link.labelKey)}
                      {link.comingSoon && <Badge>{t('comingSoon')}</Badge>}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-2 flex flex-col gap-3 border-t border-border p-2 pt-4">
              <div className="grid grid-cols-2 gap-2">
                {(['en', 'fr'] as const).map((language) => (
                  <a
                    key={language}
                    href={RESUME_FILES[language]}
                    download
                    className={cn(buttonVariants({ variant: 'outline' }), 'h-12')}
                  >
                    {t('resume')} · {t(`resumeOptions.${language}`)}
                  </a>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
