import { useQuery } from '@tanstack/react-query';
import { fetchGithubActivity } from '../api/github-activity.api';

export function useGithubActivity() {
  return useQuery({
    queryKey: ['github-activity'],
    queryFn: fetchGithubActivity,
  });
}
