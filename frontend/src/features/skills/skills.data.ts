export interface SkillGroup {
  readonly category: string;
  readonly items: readonly string[];
}

export const skillGroups: readonly SkillGroup[] = [
  {
    category: 'Backend',
    items: ['Node.js', 'NestJS', 'Go', 'REST APIs', 'GraphQL'],
  },
  {
    category: 'Data',
    items: ['PostgreSQL', 'Prisma', 'Redis'],
  },
  {
    category: 'Infrastructure',
    items: ['Docker', 'GitHub Actions', 'AWS'],
  },
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'TailwindCSS'],
  },
];
