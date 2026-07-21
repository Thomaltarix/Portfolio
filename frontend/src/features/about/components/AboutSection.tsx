import { FadeIn } from '@/components/motion/FadeIn';
import { GithubActivityWidget } from '@/features/github-activity/components/GithubActivityWidget';
import { aboutContent } from '../content';

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight">{aboutContent.heading}</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            {aboutContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <GithubActivityWidget />
        </FadeIn>
      </div>
    </section>
  );
}
