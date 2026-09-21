import type { SupportedLanguage } from '@/lib/i18n';

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
  // The language actually served; differs from the requested one when no translation exists.
  readonly locale: SupportedLanguage;
}

// Languages stored as translations: every supported language except the default (English).
export type TranslationLanguage = Exclude<SupportedLanguage, 'en'>;

export interface ProjectTranslationInput {
  title: string;
  summary: string;
  content: string;
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
