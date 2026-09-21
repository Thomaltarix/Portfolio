import { cn } from '@/lib/cn';
import type { HTMLAttributes } from 'react';

export function SectionHeading({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-4xl font-light tracking-[-0.03em] sm:text-5xl lg:text-6xl', className)}
      {...props}
    />
  );
}
