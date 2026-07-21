import { apiFetch } from '@/lib/api-client';
import type { ProjectDetail, ProjectSummary } from '../types/project.types';

export function fetchProjects(): Promise<ProjectSummary[]> {
  return apiFetch<ProjectSummary[]>('/projects');
}

export function fetchProjectBySlug(slug: string): Promise<ProjectDetail> {
  return apiFetch<ProjectDetail>(`/projects/${slug}`);
}
