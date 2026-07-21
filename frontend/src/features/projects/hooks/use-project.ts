import { useQuery } from '@tanstack/react-query';
import { fetchProjectBySlug } from '../api/projects.api';

export function useProject(slug: string | undefined) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => fetchProjectBySlug(slug!),
    enabled: Boolean(slug),
  });
}
