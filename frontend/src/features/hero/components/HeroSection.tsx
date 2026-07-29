import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function HeroSection() {
  const { t } = useTranslation('hero');

  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-28 sm:py-36">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-sm font-medium text-accent"
      >
        {t('eyebrow')}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl"
      >
        {t('title')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-xl text-lg text-muted-foreground"
      >
        {t('subtitle')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex gap-3 pt-2"
      >
        <a href="#projects" className={cn(buttonVariants({ size: 'lg' }))}>
          {t('viewProjects')}
        </a>
        <a href="#contact" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
          {t('getInTouch')}
        </a>
      </motion.div>
    </section>
  );
}
