import type { SupportedLanguage } from '@/lib/i18n';

export interface ResumeSummary {
  readonly locale: SupportedLanguage;
  readonly sizeBytes: number;
  readonly updatedAt: string;
}
