import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '@/lib/use-media-query';
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
  // The scroll drift moves the photo down, which on a phone slides its bottom edge out from under the
  // fade and shows a strip of raw photo. It is a desktop effect only.
  const isDrifting = useMediaQuery('(min-width: 640px)') && !shouldReduceMotion;
  // One line per internship, so each has its own dates.
  const roleLines = t('now.role', { returnObjects: true }) as readonly string[];
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
        style={isDrifting ? { y: imageY, scale: imageScale } : undefined}
        // Phones: the photo keeps its own height (tied to the screen width) and is aligned to the top, so the mountain
        // sits between the title and the copy instead of being stretched behind everything. From sm up it fills the hero.
        className="absolute inset-x-0 top-0 -z-20 h-[150vw] w-full object-cover object-[50%_46%] sm:inset-0 sm:h-full"
      />
      {/* Fades the photo into the page ground so the hero has no hard edge. On phones it closes the photo's own
          bottom edge (the photo is 150vw tall, so the fade spans 80vw to 150vw); from sm up it sits at the hero's bottom. */}
      <div className="absolute inset-x-0 top-[80vw] -z-10 h-[calc(70vw+2px)] bg-gradient-to-t from-background from-20% via-background/85 to-transparent sm:top-auto sm:bottom-0 sm:h-2/3 sm:from-25%" />

      <div className="mx-auto w-full max-w-6xl px-6 pt-40 max-sm:min-h-[135vw] sm:pt-52">
        <motion.h1
          {...rise(0)}
          className={cn(
            // 54rem is the width where both locales wrap onto three lines (measured: FR needs >= 800px, EN stays on three up to 920px).
            'max-w-[54rem] text-[1.75rem] font-semibold leading-[1.12] tracking-[-0.03em] min-[400px]:text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem]',
            SKY_INK,
          )}
        >
          {t('title')}
        </motion.h1>
      </div>

      <div className="mx-auto mt-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-10 pt-6 sm:gap-10 sm:pb-14 sm:pt-24">
        <div className="flex flex-col items-start gap-6">
          <motion.p {...rise(0.1)} className={cn(
            'max-w-xl text-base font-medium text-foreground sm:text-lg',
            // Halo in the page-background colour: keeps the copy legible where the photo behind it is pale.
            '[text-shadow:0_0_16px_var(--background),0_1px_3px_var(--background)]',
          )}>
            {t('subtitle')}
          </motion.p>
          <motion.div {...rise(0.18)} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href="#contact" className={cn(buttonVariants({ size: 'xl' }), 'w-full font-semibold sm:w-auto')}>
              {t('getInTouch')}
            </a>
            <a
              href="#projects"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'xl' }),
                'w-full border-2 font-semibold sm:w-auto',
                // The default outline colour is nearly the page colour in the light theme, so give it real contrast there.
                '[html.light_&]:border-foreground/50 [html.light_&]:[@media(hover:hover)]:hover:border-foreground',
              )}
            >
              {t('viewProjects')}
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
              {item === 'role' ? (
                <dd>
                  <ul className="flex flex-col gap-1 text-base text-foreground">
                    {roleLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </dd>
              ) : (
                <dd className={cn('text-base text-foreground', item === 'stack' && 'font-mono text-sm')}>
                  {t(`now.${item}`)}
                </dd>
              )}
            </div>
          ))}
        </motion.dl>

        <p className="text-xs text-muted-foreground md:text-right">{t('photoCaption')}</p>
      </div>
    </section>
  );
}
