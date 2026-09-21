import { cn } from '@/lib/cn';
import { applyLook, LOOKS, readStoredLook, type Look } from '@/lib/look';
import { useTheme } from '@/lib/theme-provider';
import { useState } from 'react';

const LOOK_LABELS: Record<Look, string> = { discreet: 'Discret', bold: 'Franc' };

// A development-only control to compare the two light looks; it renders nothing in a production
// build and nothing in the dark theme, which has a single look.
export function LookSwitch() {
  const { theme } = useTheme();
  const [look, setLook] = useState<Look>(readStoredLook);

  if (!import.meta.env.DEV || theme !== 'light') return null;

  const choose = (next: Look) => {
    applyLook(next);
    setLook(next);
  };

  return (
    <div
      role="group"
      aria-label="Variante du thème clair (développement)"
      className="fixed bottom-4 left-4 z-40 flex gap-1 rounded-full border border-border bg-background/90 p-1 backdrop-blur-md"
    >
      {LOOKS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={look === option}
          onClick={() => choose(option)}
          className={cn(
            'h-9 rounded-full px-4 text-sm font-medium transition-colors duration-150',
            look === option ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
          )}
        >
          {LOOK_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
