import { FadeIn } from '@/components/motion/FadeIn';
import { experienceEntries } from '../experience.data';

export function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
      </FadeIn>

      <div className="mt-10 space-y-10 border-l border-border pl-8">
        {experienceEntries.map((entry, index) => (
          <FadeIn key={entry.company} delay={index * 0.05}>
            <div className="relative">
              <span className="absolute -left-[2.15rem] top-1.5 size-2 rounded-full bg-accent" />
              <p className="text-sm text-muted-foreground">{entry.period}</p>
              <h3 className="mt-1 text-lg font-medium">
                {entry.role} · {entry.company}
              </h3>
              <p className="mt-2 max-w-2xl text-muted-foreground">{entry.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
