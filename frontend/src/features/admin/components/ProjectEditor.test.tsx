import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/render';
import type { ProjectDetail } from '@/features/projects/types/project.types';
import { ProjectEditor } from './ProjectEditor';

const { fetchProjectBySlugMock } = vi.hoisted(() => ({ fetchProjectBySlugMock: vi.fn() }));

vi.mock('@/features/projects/api/projects.api', () => ({
  fetchProjectBySlug: fetchProjectBySlugMock,
  createProject: vi.fn(),
  updateProject: vi.fn(),
  upsertProjectTranslation: vi.fn(),
  deleteProjectTranslation: vi.fn(),
}));

const project: ProjectDetail = {
  id: 'project-id',
  slug: 'melo',
  title: 'Melo',
  summary: 'A music event app.',
  techStack: ['Go'],
  githubUrl: null,
  liveUrl: null,
  featured: true,
  content: '## What it is',
  locale: 'en',
};

function labelsIn(panelId: string): string[] {
  const panel = document.getElementById(panelId);
  return [...(panel?.querySelectorAll('label') ?? [])].map((label) => label.textContent?.trim() ?? '');
}

describe('ProjectEditor', () => {
  afterEach(() => fetchProjectBySlugMock.mockReset());

  it('shows the same slug and text fields, in the same order, in English and French', async () => {
    fetchProjectBySlugMock.mockResolvedValue(project);

    renderWithProviders(<ProjectEditor project={project} onSaved={vi.fn()} onClose={vi.fn()} />);
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Français' })).toBeEnabled());

    const shared = ['Slug', 'Titre', 'Résumé', 'Contenu (markdown)'];
    expect(labelsIn('panel-en').slice(0, shared.length)).toEqual(shared);
    expect(labelsIn('panel-fr').slice(0, shared.length)).toEqual(shared);
  });

  it('gives the summary and the write-up the same size in both languages', async () => {
    fetchProjectBySlugMock.mockResolvedValue(project);

    renderWithProviders(<ProjectEditor project={project} onSaved={vi.fn()} onClose={vi.fn()} />);
    await waitFor(() => expect(document.getElementById('fr-summary')).not.toBeNull());

    for (const field of ['summary', 'content']) {
      const english = document.getElementById(`en-${field}`);
      const french = document.getElementById(`fr-${field}`);
      expect(english?.className).toBe(french?.className);
    }
  });

  it('keeps the French tab disabled while a project is being created, with a hint', () => {
    renderWithProviders(<ProjectEditor onSaved={vi.fn()} onClose={vi.fn()} />);

    expect(screen.getByRole('tab', { name: 'Français' })).toBeDisabled();
    expect(screen.getByText(/Enregistre d'abord le projet en anglais/)).toBeInTheDocument();
    expect(document.getElementById('panel-fr')).toBeNull();
  });
});
