import type { SupportedLanguage } from '@/lib/i18n';
import { useSiteLanguage } from '@/lib/use-site-language';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchProjectBySlug } from '../api/projects.api';

export function useProject(slug: string | undefined, language?: SupportedLanguage) {
  const siteLanguage = useSiteLanguage();
  const projectLanguage = language ?? siteLanguage;

  return useQuery({
    queryKey: ['projects', projectLanguage, slug],
    queryFn: () => fetchProjectBySlug(slug!, projectLanguage),
    enabled: Boolean(slug),
    placeholderData: keepPreviousData,
  });
}
