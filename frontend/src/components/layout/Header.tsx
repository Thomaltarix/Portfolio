import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#playground', label: 'Playground' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="text-sm font-semibold tracking-tight">
          portfolio
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/resume.pdf"
            download
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Resume
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
