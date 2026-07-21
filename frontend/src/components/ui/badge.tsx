import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}
