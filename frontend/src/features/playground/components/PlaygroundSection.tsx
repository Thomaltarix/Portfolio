import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from 'react-i18next';

export function PlaygroundSection() {
  const { t } = useTranslation('playground');

  return (
    <section id="playground" className="mx-auto max-w-6xl px-6 py-20 md:py-32">
      <FadeIn>
        <SectionHeading>{t('heading')}</SectionHeading>
        <Card className="mt-16 p-10">
          <CardTitle className="text-3xl font-light tracking-tight sm:text-4xl">{t('comingSoonTitle')}</CardTitle>
          <CardDescription className="mt-2">{t('comingSoonDescription')}</CardDescription>
        </Card>
      </FadeIn>
    </section>
  );
}
