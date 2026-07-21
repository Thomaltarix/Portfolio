export interface ExperienceEntry {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly description: string;
}

export const experienceEntries: readonly ExperienceEntry[] = [
  {
    company: 'Company Name',
    role: 'Senior Backend Engineer',
    period: '2023 — Present',
    description:
      'Own the API and data layer for a product used by thousands of daily active users; led the migration from a monolith to modular NestJS services.',
  },
  {
    company: 'Previous Company',
    role: 'Software Engineer',
    period: '2020 — 2023',
    description:
      'Built and maintained internal tooling and public-facing APIs, with a focus on observability and deployment reliability.',
  },
  {
    company: 'Earlier Company',
    role: 'Junior Developer',
    period: '2018 — 2020',
    description: 'Started out on a small full-stack team, shipping features end to end.',
  },
];
