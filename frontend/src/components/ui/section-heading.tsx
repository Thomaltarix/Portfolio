import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

export function SectionHeading({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl', className)} {...props}>
      <span className="h-px w-6 shrink-0 bg-accent" aria-hidden="true" />
      {children}
    </h2>
  );
}
