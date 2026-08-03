export interface ProjectSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly techStack: readonly string[];
  readonly githubUrl: string | null;
  readonly liveUrl: string | null;
  readonly featured: boolean;
}

export interface ProjectDetail extends ProjectSummary {
  readonly content: string;
}

export interface ProjectInput {
  slug: string;
  title: string;
  summary: string;
  content: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}
