import { apiFetch } from '@/lib/api-client';
import type { AnalyticsStats } from '../types';

export function trackPageView(path: string, referrer?: string): Promise<void> {
  return apiFetch<void>('/analytics/track', {
    method: 'POST',
    body: JSON.stringify(referrer ? { path, referrer } : { path }),
  });
}

export function fetchAnalyticsStats(days: number): Promise<AnalyticsStats> {
  return apiFetch<AnalyticsStats>(`/analytics/stats?days=${days}`);
}
