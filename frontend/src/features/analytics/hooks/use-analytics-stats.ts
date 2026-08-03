import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsStats } from '../api/analytics.api';

export function useAnalyticsStats(days: number) {
  return useQuery({
    queryKey: ['analytics', 'stats', days],
    queryFn: () => fetchAnalyticsStats(days),
  });
}
