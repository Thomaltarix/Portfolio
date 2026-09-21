import { cn } from '@/lib/cn';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ButtonHTMLAttributes, Ref } from 'react';

// Pills for every interactive control; the press scale is the only hover-independent
// feedback so it still reads on touch. Hover styles are gated to real pointers.
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[transform,background-color,border-color] duration-150 ease-out-strong active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground [@media(hover:hover)]:hover:brightness-110',
        outline:
          'border border-border bg-transparent [@media(hover:hover)]:hover:border-foreground/40',
        ghost: 'bg-transparent [@media(hover:hover)]:hover:bg-surface',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-9 px-4',
        lg: 'h-12 px-7 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ref?: Ref<HTMLButtonElement>;
}

export function Button({ className, variant, size, ref, ...props }: ButtonProps) {
  return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
