import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from 'react-i18next';

export function PlaygroundSection() {
  const { t } = useTranslation('playground');

  return (
    <section id="playground" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <SectionHeading>{t('heading')}</SectionHeading>
        <Card className="mt-10">
          <CardTitle>{t('comingSoonTitle')}</CardTitle>
          <CardDescription className="mt-2">{t('comingSoonDescription')}</CardDescription>
        </Card>
      </FadeIn>
    </section>
  );
}
