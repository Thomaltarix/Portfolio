import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/i18n';
import { useTheme } from '@/lib/theme-provider';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const RESUME_FILES = {
  en: '/resume-en.pdf',
  fr: '/resume-fr.pdf',
} as const;

const IS_MAC =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);

interface Command {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly keywords?: readonly string[];
  readonly onSelect: () => void;
}

function triggerDownload(href: string) {
  const link = document.createElement('a');
  link.href = href;
  link.download = '';
  link.click();
}

// Strips diacritics so searching "a pr" matches "À propos" — visitors
// shouldn't need the right accent keys to find a command.
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function CommandPalette() {
  const { t, i18n } = useTranslation('common');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
    triggerRef.current?.focus();
  };

  // Mirrors what a plain <a href="#about"> already does elsewhere in the
  // header nav — same limitation too: a section only scrolls if it exists
  // on the current page, otherwise this lands on "/" with the hash set.
  const goToHash = (hash: string) => {
    if (location.pathname === '/') {
      window.location.hash = hash;
    } else {
      navigate(`/#${hash}`);
    }
  };

  const resolvedLanguage = i18n.resolvedLanguage ?? 'en';
  const currentLanguage: SupportedLanguage = SUPPORTED_LANGUAGES.includes(
    resolvedLanguage as SupportedLanguage,
  )
    ? (resolvedLanguage as SupportedLanguage)
    : 'en';
  const nextLanguage = SUPPORTED_LANGUAGES.find((language) => language !== currentLanguage) ?? 'en';

  const commands = useMemo<Command[]>(
    () => [
      { id: 'about', label: t('nav.about'), onSelect: () => goToHash('about') },
      { id: 'experience', label: t('nav.experience'), onSelect: () => goToHash('experience') },
      {
        id: 'projects',
        label: t('nav.projects'),
        hint: t('comingSoon'),
        onSelect: () => goToHash('projects'),
      },
      {
        id: 'playground',
        label: t('nav.playground'),
        hint: t('comingSoon'),
        onSelect: () => goToHash('playground'),
      },
      { id: 'contact', label: t('nav.contact'), onSelect: () => goToHash('contact') },
      {
        id: 'theme',
        label: theme === 'dark' ? t('commandPalette.lightTheme') : t('commandPalette.darkTheme'),
        keywords: ['theme', 'dark', 'light', 'sombre', 'clair'],
        onSelect: toggleTheme,
      },
      {
        id: 'language',
        label: t('language.switchTo', { language: t(`language.${nextLanguage}`) }),
        keywords: ['language', 'langue', 'fr', 'en'],
        onSelect: () => i18n.changeLanguage(nextLanguage),
      },
      {
        id: 'resume',
        label: t('commandPalette.downloadResume'),
        keywords: ['resume', 'cv', 'pdf'],
        onSelect: () => triggerDownload(RESUME_FILES[currentLanguage]),
      },
      { id: 'top', label: t('footer.backToTop'), onSelect: () => goToHash('top') },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, theme, currentLanguage, nextLanguage, location.pathname],
  );

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return commands;
    return commands.filter(
      (command) =>
        normalize(command.label).includes(q) ||
        command.keywords?.some((keyword) => normalize(keyword).includes(q)),
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [filtered.length, query]);

  const runCommand = (command: Command | undefined) => {
    if (!command) return;
    command.onSelect();
    close();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((open) => !open);
        return;
      }
      if (!isOpen) return;

      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        runCommand(filtered[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filtered, activeIndex]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      <Button
        ref={triggerRef}
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        aria-label={t('commandPalette.triggerLabel')}
        className="gap-1.5 text-muted-foreground"
      >
        <Search className="size-3.5" aria-hidden="true" />
        <span className="hidden font-mono text-xs sm:inline">{IS_MAC ? '⌘K' : 'Ctrl K'}</span>
      </Button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 px-4 pt-[15vh] backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t('commandPalette.title')}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-lg border border-border bg-background shadow-lg"
            >
              <div className="flex items-center gap-2 border-b border-border px-4">
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('commandPalette.placeholder')}
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <ul role="listbox" className="max-h-72 overflow-y-auto p-1">
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                    {t('commandPalette.empty')}
                  </li>
                )}
                {filtered.map((command, index) => (
                  <li key={command.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => runCommand(command)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors',
                        index === activeIndex ? 'bg-surface text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      <span>{command.label}</span>
                      {command.hint && <span className="text-xs text-muted-foreground">{command.hint}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>,
          document.body,
        )}
    </>
  );
}
