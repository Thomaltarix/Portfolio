import type { SupportedLanguage } from '@/lib/i18n';
import { useSiteLanguage } from '@/lib/use-site-language';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../api/projects.api';

// Public pages follow the site language. The admin passes the default language
// explicitly, because what it edits and saves is always the default-language text.
export function useProjects(language?: SupportedLanguage) {
  const siteLanguage = useSiteLanguage();
  const projectsLanguage = language ?? siteLanguage;

  return useQuery({
    queryKey: ['projects', projectsLanguage],
    queryFn: () => fetchProjects(projectsLanguage),
    // Keeps the list on screen while the other language loads, instead of flashing a loader.
    placeholderData: keepPreviousData,
  });
}
