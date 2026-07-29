import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  const { t } = useTranslation('not-found');

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start px-6 py-32">
      <p className="text-sm font-medium text-accent">{t('eyebrow')}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mt-3 text-muted-foreground">{t('description')}</p>
      <Link to="/" className={cn(buttonVariants(), 'mt-6')}>
        {t('backHome')}
      </Link>
    </section>
  );
}
