import { useQuery } from '@tanstack/react-query';
import { fetchResumeSummaries } from '../api/resume.api';

export const RESUME_SUMMARIES_QUERY_KEY = ['resume', 'summaries'] as const;

export function useResumeSummaries() {
  return useQuery({
    queryKey: RESUME_SUMMARIES_QUERY_KEY,
    queryFn: fetchResumeSummaries,
  });
}
