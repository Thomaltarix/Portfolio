import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ProjectDetail } from '@/features/projects/types/project.types';
import { ProjectDetailPage } from './ProjectDetailPage';

const { fetchProjectBySlugMock } = vi.hoisted(() => ({
  fetchProjectBySlugMock: vi.fn(),
}));

vi.mock('@/features/projects/api/projects.api', () => ({
  fetchProjectBySlug: fetchProjectBySlugMock,
}));

const project: ProjectDetail = {
  id: '1',
  slug: 'realtime-chat-platform',
  title: 'Realtime Chat Platform',
  summary: 'A chat platform.',
  techStack: ['NestJS', 'React'],
  githubUrl: 'https://github.com/example/chat',
  liveUrl: 'https://chat.example.com',
  featured: true,
  content: '## Overview\n\nBuilt with NestJS and React.',
};

function renderPage(slug: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <MemoryRouter initialEntries={[`/projects/${slug}`]}>
          <Routes>
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    </QueryClientProvider>,
  );
}

describe('ProjectDetailPage', () => {
  afterEach(() => {
    fetchProjectBySlugMock.mockReset();
  });

  it('shows a loading state while the project is being fetched', () => {
    fetchProjectBySlugMock.mockReturnValue(new Promise(() => {}));

    renderPage(project.slug);

    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows a not-found message when the project fails to load', async () => {
    fetchProjectBySlugMock.mockRejectedValue(new Error('Not found'));

    renderPage('missing-project');

    await waitFor(() => {
      expect(screen.getByText('Project not found.')).toBeInTheDocument();
    });
  });

  it('renders the project details, tech stack and markdown content once loaded', async () => {
    fetchProjectBySlugMock.mockResolvedValue(project);

    renderPage(project.slug);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument();
    });
    expect(screen.getByText('NestJS')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });

  it('only renders source/live links when the corresponding URL is set', async () => {
    fetchProjectBySlugMock.mockResolvedValue({ ...project, liveUrl: null });

    renderPage(project.slug);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'View source' })).toBeInTheDocument();
    });
    expect(screen.queryByRole('link', { name: 'Live demo' })).not.toBeInTheDocument();
  });
});
