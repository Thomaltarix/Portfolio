import { apiFetch } from '@/lib/api-client';
import type { SystemHealth } from '../types';

export function fetchSystemHealth(): Promise<SystemHealth> {
  return apiFetch<SystemHealth>('/health');
}
