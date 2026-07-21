import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/motion/FadeIn';

export function PlaygroundSection() {
  return (
    <section id="playground" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <h2 className="text-2xl font-semibold tracking-tight">Playground</h2>
        <Card className="mt-10">
          <CardTitle>Coming soon</CardTitle>
          <CardDescription className="mt-2">
            A space for small interactive experiments. Not built yet — see the project roadmap.
          </CardDescription>
        </Card>
      </FadeIn>
    </section>
  );
}
