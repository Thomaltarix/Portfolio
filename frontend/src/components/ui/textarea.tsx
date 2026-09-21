import { cn } from '@/lib/cn';
import type { TextareaHTMLAttributes } from 'react';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-36 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-base sm:min-h-32 sm:text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent',
        className,
      )}
      {...props}
    />
  );
}
