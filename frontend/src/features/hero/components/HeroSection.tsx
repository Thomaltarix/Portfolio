import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const NOW_ITEMS = ['role', 'studying', 'stack'] as const;

const EASE_OUT_STRONG = [0.23, 1, 0.32, 1] as const;

// The headline sits on the photo's sky, which stays mid-grey in both themes,
// so it uses a fixed ink colour instead of the theme tokens.
const SKY_INK = 'text-[#0d1116]';

export function HeroSection() {
  const { t } = useTranslation('hero');
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  // The mountain drifts down and grows slightly as you leave it: the page "climbs" away.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const rise = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE_OUT_STRONG },
        };

  return (
    <section ref={sectionRef} className="relative isolate -mt-[4.5rem] flex min-h-svh flex-col overflow-hidden">
      <motion.img
        src="/images/fuji-dawn-2560.webp"
        srcSet="/images/fuji-dawn-1600.webp 1600w, /images/fuji-dawn-2560.webp 2560w, /images/fuji-dawn-3840.webp 3840w"
        sizes="100vw"
        alt=""
        fetchPriority="high"
        style={shouldReduceMotion ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[50%_72%]"
      />
      {/* Fades the photo into the page ground so the hero has no hard edge. */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-t from-background from-15% via-background/75 to-transparent max-sm:h-4/5 max-sm:from-30% max-sm:via-background/90" />

      <div className="mx-auto w-full max-w-6xl px-6 pt-48 sm:pt-52">
        <motion.h1
          {...rise(0)}
          className={cn(
            'max-w-4xl text-4xl font-light leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl',
            SKY_INK,
          )}
        >
          {t('title')}
        </motion.h1>
      </div>

      <div className="mx-auto mt-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-14 pt-24">
        <div className="flex flex-col items-start gap-6">
          <motion.p {...rise(0.1)} className="max-w-xl text-lg text-foreground/80">
            {t('subtitle')}
          </motion.p>
          <motion.div {...rise(0.18)} className="flex flex-wrap gap-3">
            <a href="#projects" className={cn(buttonVariants({ size: 'lg' }))}>
              {t('viewProjects')}
            </a>
            <a href="#contact" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              {t('getInTouch')}
            </a>
          </motion.div>
        </div>

        <motion.dl
          {...rise(0.3)}
          aria-label={t('now.label')}
          className="grid gap-x-10 gap-y-6 border-t border-foreground/15 pt-8 md:grid-cols-3"
        >
          {NOW_ITEMS.map((item) => (
            <div key={item} className="flex flex-col gap-1.5">
              <dt className="text-sm text-muted-foreground">{t(`now.${item}Label`)}</dt>
              <dd className={cn('text-base text-foreground', item === 'stack' && 'font-mono text-sm')}>
                {t(`now.${item}`)}
              </dd>
            </div>
          ))}
        </motion.dl>

        <p className="text-xs text-muted-foreground md:text-right">{t('photoCaption')}</p>
      </div>
    </section>
  );
}
