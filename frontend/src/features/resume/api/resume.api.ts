import { apiFetch, apiUrl } from '@/lib/api-client';
import type { SupportedLanguage } from '@/lib/i18n';
import type { ResumeSummary } from '../types';

export function resumeDownloadUrl(locale: SupportedLanguage): string {
  return apiUrl(`/resume/${locale}`);
}

export function fetchResumeSummaries(): Promise<ResumeSummary[]> {
  return apiFetch<ResumeSummary[]>('/resume');
}

export function uploadResume(locale: SupportedLanguage, file: File): Promise<ResumeSummary> {
  const body = new FormData();
  body.append('file', file);
  return apiFetch<ResumeSummary>(`/resume/${locale}`, { method: 'PUT', body });
}
