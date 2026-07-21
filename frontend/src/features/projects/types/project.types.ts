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
