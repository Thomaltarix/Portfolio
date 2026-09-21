import { FadeIn } from '@/components/motion/FadeIn';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from 'react-i18next';

export function AboutSection() {
  const { t } = useTranslation('about');
  const [statement, ...supportingParagraphs] = t('paragraphs', {
    returnObjects: true,
  }) as readonly string[];

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <FadeIn>
          <SectionHeading>{t('heading')}</SectionHeading>
        </FadeIn>

        <div>
          <FadeIn>
            <p className="text-2xl font-light leading-snug tracking-tight sm:text-3xl lg:text-4xl">
              {statement}
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-12 grid gap-8 text-muted-foreground md:grid-cols-2">
              {supportingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
