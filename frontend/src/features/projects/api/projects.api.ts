import { apiFetch } from '@/lib/api-client';
import type { SupportedLanguage } from '@/lib/i18n';
import type { ProjectDetail, ProjectInput, ProjectSummary } from '../types/project.types';

export function fetchProjects(language: SupportedLanguage): Promise<ProjectSummary[]> {
  return apiFetch<ProjectSummary[]>(`/projects?lang=${language}`);
}

export function fetchProjectBySlug(slug: string, language: SupportedLanguage): Promise<ProjectDetail> {
  return apiFetch<ProjectDetail>(`/projects/${slug}?lang=${language}`);
}

export function createProject(input: ProjectInput): Promise<ProjectDetail> {
  return apiFetch<ProjectDetail>('/projects', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateProject(
  id: string,
  input: Partial<ProjectInput>,
): Promise<ProjectDetail> {
  return apiFetch<ProjectDetail>(`/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteProject(id: string): Promise<void> {
  return apiFetch<void>(`/projects/${id}`, { method: 'DELETE' });
}
