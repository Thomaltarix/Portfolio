import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enAbout from '@/locales/en/about.json';
import enCommon from '@/locales/en/common.json';
import enContact from '@/locales/en/contact.json';
import enExperience from '@/locales/en/experience.json';
import enGithubActivity from '@/locales/en/github-activity.json';
import enNotFound from '@/locales/en/not-found.json';
import enPlayground from '@/locales/en/playground.json';
import enProjects from '@/locales/en/projects.json';
import enSkills from '@/locales/en/skills.json';
import enHero from '@/locales/en/hero.json';

import frAbout from '@/locales/fr/about.json';
import frCommon from '@/locales/fr/common.json';
import frContact from '@/locales/fr/contact.json';
import frExperience from '@/locales/fr/experience.json';
import frGithubActivity from '@/locales/fr/github-activity.json';
import frNotFound from '@/locales/fr/not-found.json';
import frPlayground from '@/locales/fr/playground.json';
import frProjects from '@/locales/fr/projects.json';
import frSkills from '@/locales/fr/skills.json';
import frHero from '@/locales/fr/hero.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  en: {
    common: enCommon,
    hero: enHero,
    about: enAbout,
    experience: enExperience,
    skills: enSkills,
    projects: enProjects,
    contact: enContact,
    playground: enPlayground,
    'github-activity': enGithubActivity,
    'not-found': enNotFound,
  },
  fr: {
    common: frCommon,
    hero: frHero,
    about: frAbout,
    experience: frExperience,
    skills: frSkills,
    projects: frProjects,
    contact: frContact,
    playground: frPlayground,
    'github-activity': frGithubActivity,
    'not-found': frNotFound,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: Object.keys(resources.en),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'portfolio-language',
    },
  });

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language;
});

export default i18n;
