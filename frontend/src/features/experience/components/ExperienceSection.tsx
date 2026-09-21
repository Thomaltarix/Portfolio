import { FadeIn } from '@/components/motion/FadeIn';
import { SectionHeading } from '@/components/ui/section-heading';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { ExperienceEntry } from '../types';

// A trail that draws itself as you scroll down it: the accent line is the ground
// already covered, so the career reads as a route rather than a list.
export function ExperienceSection() {
  const { t } = useTranslation('experience');
  const entries = t('entries', { returnObjects: true }) as readonly ExperienceEntry[];
  const shouldReduceMotion = useReducedMotion();
  const trailRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trailRef, offset: ['start 0.7', 'end 0.6'] });

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-20 md:py-32">
      <FadeIn>
        <SectionHeading>{t('heading')}</SectionHeading>
      </FadeIn>

      <div ref={trailRef} className="relative mt-12 pl-10 sm:pl-16 md:mt-20">
        <div className="absolute bottom-0 left-3 top-0 w-px bg-border sm:left-5" aria-hidden="true" />
        <motion.div
          style={{ scaleY: shouldReduceMotion ? 1 : scrollYProgress }}
          className="absolute bottom-0 left-3 top-0 w-px origin-top bg-accent sm:left-5"
          aria-hidden="true"
        />

        {entries.map((entry, index) => (
          <FadeIn key={entry.company} delay={index * 0.04} className="pb-14 last:pb-0 md:pb-20">
            <article className="relative">
              <span
                className="absolute -left-[2.1rem] top-3 size-3 rounded-full border-2 border-accent bg-background sm:-left-[3.1rem]"
                aria-hidden="true"
              />
              <p className="font-mono text-sm text-muted-foreground">{entry.period}</p>
              <h3 className="mt-3 text-3xl font-light tracking-tight sm:text-5xl">{entry.company}</h3>
              <p className="mt-2 text-lg text-accent">{entry.role}</p>
              <p className="mt-4 max-w-2xl text-muted-foreground">{entry.description}</p>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
