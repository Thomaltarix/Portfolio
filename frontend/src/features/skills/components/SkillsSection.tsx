import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from 'react-i18next';
import type { SkillGroup } from '../types';

export function SkillsSection() {
  const { t } = useTranslation('skills');
  const groups = t('groups', { returnObjects: true }) as readonly SkillGroup[];

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <SectionHeading>{t('heading')}</SectionHeading>
      </FadeIn>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {groups.map((group, index) => (
          <FadeIn key={group.category} delay={index * 0.05}>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
