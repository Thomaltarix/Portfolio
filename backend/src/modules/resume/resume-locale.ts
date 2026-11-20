export const RESUME_LOCALES = ['en', 'fr'] as const;
export type ResumeLocale = (typeof RESUME_LOCALES)[number];

export const RESUME_FILE_NAMES: Readonly<Record<ResumeLocale, string>> = {
  en: 'thomas-boue-resume-en.pdf',
  fr: 'thomas-boue-cv-fr.pdf',
};

export const RESUME_MAX_SIZE_BYTES = 5 * 1024 * 1024;
