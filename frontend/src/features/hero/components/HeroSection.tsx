import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const NOW_ITEMS = ['role', 'studying', 'stack'] as const;

// Sparse via-dots at grid intersections — closer to a PCB silkscreen than
// plain graph paper. Positions are hand-picked, not generated, so they read
// as placed rather than random noise.
const VIAS = [
  { cx: '14%', cy: '18%' },
  { cx: '38%', cy: '10%' },
  { cx: '8%', cy: '44%' },
  { cx: '30%', cy: '58%' },
  { cx: '20%', cy: '82%' },
] as const;

export function HeroSection() {
  const { t } = useTranslation('hero');

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          opacity: 0.5,
          maskImage: 'radial-gradient(ellipse 80% 60% at 25% 15%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 25% 15%, black 40%, transparent 85%)',
        }}
        aria-hidden="true"
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {VIAS.map((via) => (
          <circle key={via.cx + via.cy} cx={via.cx} cy={via.cy} r="2" className="fill-border" />
        ))}
      </svg>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="flex flex-col items-start gap-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent"
          >
            <span className="h-px w-5 bg-accent" aria-hidden="true" />
            {t('eyebrow')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-5xl lg:text-6xl"
          >
            {t('title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-lg text-lg text-muted-foreground"
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
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t('now.label')}
          </p>
          <div className="flex flex-col">
            {NOW_ITEMS.map((item) => (
              <div
                key={item}
                className="relative border border-border bg-surface px-5 py-4 [&:not(:first-child)]:border-t-0"
              >
                <span className="absolute inset-y-0 -left-px w-0.5 bg-accent/60" aria-hidden="true" />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    {t(`now.${item}Label`)}
                  </span>
                  <span className="text-right text-sm text-foreground">{t(`now.${item}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
