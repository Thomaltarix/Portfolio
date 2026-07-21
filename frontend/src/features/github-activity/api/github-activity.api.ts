import { apiFetch } from '@/lib/api-client';
import type { GithubActivityItem } from '../types';

export function fetchGithubActivity(): Promise<GithubActivityItem[]> {
  return apiFetch<GithubActivityItem[]>('/github/activity');
}
