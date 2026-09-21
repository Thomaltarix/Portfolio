import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '@/test/render';
import type { ProjectDetail } from '@/features/projects/types/project.types';
import { ProjectTranslationForm } from './ProjectTranslationForm';

const { fetchProjectBySlugMock, upsertMock } = vi.hoisted(() => ({
  fetchProjectBySlugMock: vi.fn(),
  upsertMock: vi.fn(),
}));

vi.mock('@/features/projects/api/projects.api', () => ({
  fetchProjectBySlug: fetchProjectBySlugMock,
  upsertProjectTranslation: upsertMock,
  deleteProjectTranslation: vi.fn(),
}));

const english: ProjectDetail = {
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

const french: ProjectDetail = {
  ...english,
  title: 'Melo (FR)',
  summary: 'Une application.',
  content: "## De quoi s'agit-il",
  locale: 'fr',
};

describe('ProjectTranslationForm', () => {
  afterEach(() => {
    fetchProjectBySlugMock.mockReset();
    upsertMock.mockReset();
  });

  it('says the site falls back to English when there is no translation yet', async () => {
    // The API answers with the default language and locale "en" when no translation exists.
    fetchProjectBySlugMock.mockResolvedValue(english);

    renderWithProviders(<ProjectTranslationForm project={english} language="fr" />);

    expect(await screen.findByText(/Aucune traduction en français/)).toBeInTheDocument();
    expect(screen.getByLabelText('Titre')).toHaveValue('');
  });

  it('pre-fills the fields from the English text on request', async () => {
    fetchProjectBySlugMock.mockResolvedValue(english);
    renderWithProviders(<ProjectTranslationForm project={english} language="fr" />);

    await userEvent.click(await screen.findByRole('button', { name: "Pré-remplir avec l'anglais" }));

    expect(screen.getByLabelText('Titre')).toHaveValue('Melo');
    expect(screen.getByLabelText('Résumé')).toHaveValue('A music event app.');
  });

  it('shows an existing translation and offers to delete it', async () => {
    fetchProjectBySlugMock.mockResolvedValue(french);

    renderWithProviders(<ProjectTranslationForm project={english} language="fr" />);

    await waitFor(() => expect(screen.getByLabelText('Titre')).toHaveValue('Melo (FR)'));
    expect(screen.getByText(/Traduction en français publiée/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Supprimer la traduction' })).toBeInTheDocument();
  });

  it('saves the translation for the project and language', async () => {
    fetchProjectBySlugMock.mockResolvedValue(french);
    upsertMock.mockResolvedValue(french);
    renderWithProviders(<ProjectTranslationForm project={english} language="fr" />);
    await waitFor(() => expect(screen.getByLabelText('Titre')).toHaveValue('Melo (FR)'));

    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer la traduction' }));

    await waitFor(() =>
      expect(upsertMock).toHaveBeenCalledWith('project-id', 'fr', {
        title: 'Melo (FR)',
        summary: 'Une application.',
        content: "## De quoi s'agit-il",
      }),
    );
  });
});
