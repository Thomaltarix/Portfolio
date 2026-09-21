import type { ReactNode } from 'react';

export interface LegalSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

interface LegalDocumentProps {
  readonly title: string;
  readonly updatedLabel: string;
  readonly sections: readonly LegalSection[];
  readonly children?: ReactNode;
}

export function LegalDocument({ title, updatedLabel, sections, children }: LegalDocumentProps) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 font-mono text-xs text-muted-foreground">{updatedLabel}</p>

      {sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      {children}
    </article>
  );
}
