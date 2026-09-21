// English is stored on the Project columns themselves; every other locale is a
// ProjectTranslation row, so adding a language means adding a value here and seeding it.
export const PROJECT_LOCALES = ['en', 'fr'] as const;
export type ProjectLocale = (typeof PROJECT_LOCALES)[number];
export const DEFAULT_PROJECT_LOCALE: ProjectLocale = 'en';
