import { apiFetch } from '@/lib/api-client';
import type { ProjectDetail, ProjectInput, ProjectSummary } from '../types/project.types';

export function fetchProjects(): Promise<ProjectSummary[]> {
  return apiFetch<ProjectSummary[]>('/projects');
}

export function fetchProjectBySlug(slug: string): Promise<ProjectDetail> {
  return apiFetch<ProjectDetail>(`/projects/${slug}`);
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
