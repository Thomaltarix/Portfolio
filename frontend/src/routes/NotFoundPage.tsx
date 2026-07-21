import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start px-6 py-32">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link to="/" className={cn(buttonVariants(), 'mt-6')}>
        Back home
      </Link>
    </section>
  );
}
