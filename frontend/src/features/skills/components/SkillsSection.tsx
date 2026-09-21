import { FadeIn } from '@/components/motion/FadeIn';
import { SectionHeading } from '@/components/ui/section-heading';
import { cn } from '@/lib/cn';
import { useTranslation } from 'react-i18next';
import type { SkillGroup } from '../types';

export function SkillsSection() {
  const { t } = useTranslation('skills');
  const groups = t('groups', { returnObjects: true }) as readonly SkillGroup[];

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-32">
      <FadeIn>
        <SectionHeading>{t('heading')}</SectionHeading>
      </FadeIn>

      <dl className="mt-16 divide-y divide-border border-y border-border">
        {groups.map((group, index) => (
          <FadeIn key={group.category} delay={index * 0.04}>
            <div className="grid gap-4 py-8 md:grid-cols-[1fr_2.4fr] md:gap-12">
              <dt className="pt-2 text-sm text-muted-foreground">{group.category}</dt>
              <dd className="flex flex-wrap gap-x-7 gap-y-2 text-2xl font-light tracking-tight sm:text-3xl">
                {group.items.map((item, itemIndex) => (
                  <span
                    key={item}
                    className={cn(
                      'transition-colors duration-150',
                      itemIndex === 0
                        ? 'text-foreground'
                        : 'text-muted-foreground [@media(hover:hover)]:hover:text-foreground',
                    )}
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          </FadeIn>
        ))}
      </dl>
    </section>
  );
}
