import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/motion/FadeIn';
import { skillGroups } from '../skills.data';

export function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
      </FadeIn>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {skillGroups.map((group, index) => (
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
