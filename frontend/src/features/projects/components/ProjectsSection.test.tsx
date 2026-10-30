import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/lib/i18n';
import { renderWithProviders, screen, waitFor } from '@/test/render';
import type { ProjectSummary } from '../types/project.types';
import { ProjectsSection } from './ProjectsSection';

const { fetchProjectsMock } = vi.hoisted(() => ({
  fetchProjectsMock: vi.fn(),
}));

vi.mock('../api/projects.api', () => ({
  fetchProjects: fetchProjectsMock,
}));

const projects: ProjectSummary[] = [
  {
    id: '1',
    slug: 'realtime-chat-platform',
    title: 'Realtime Chat Platform',
    summary: 'A chat platform.',
    techStack: ['NestJS'],
    githubUrl: null,
    liveUrl: null,
    featured: true,
  },
  {
    id: '2',
    slug: 'portfolio-site',
    title: 'Portfolio Site',
    summary: 'This very site.',
    techStack: ['React'],
    githubUrl: null,
    liveUrl: null,
    featured: false,
  },
];

describe('ProjectsSection', () => {
  afterEach(async () => {
    fetchProjectsMock.mockReset();
    await act(() => i18n.changeLanguage('en'));
  });

  it('shows a loading state while the projects are being fetched', () => {
    fetchProjectsMock.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<ProjectsSection />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows an error state when the request fails', async () => {
    fetchProjectsMock.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<ProjectsSection />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/couldn't load projects/i)).toBeInTheDocument();
  });

  it('shows a coming-soon message when there are no projects yet', async () => {
    fetchProjectsMock.mockResolvedValue([]);

    renderWithProviders(<ProjectsSection />);

    await waitFor(() => {
      expect(screen.getByText('Coming soon')).toBeInTheDocument();
    });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders one card per project once loaded', async () => {
    fetchProjectsMock.mockResolvedValue(projects);

    renderWithProviders(<ProjectsSection />);

    await waitFor(() => {
      expect(screen.getAllByRole('link')).toHaveLength(projects.length);
    });
    expect(screen.getByText('Realtime Chat Platform')).toBeInTheDocument();
    expect(screen.getByText('Portfolio Site')).toBeInTheDocument();
  });

  it('lists featured projects under their own group, before the others', async () => {
    fetchProjectsMock.mockResolvedValue(projects);

    renderWithProviders(<ProjectsSection />);

    const featuredHeading = await screen.findByRole('heading', { name: 'IoT and systems' });
    const otherHeading = screen.getByRole('heading', { name: 'Web and backend' });
    const featuredCard = screen.getByText('Realtime Chat Platform');
    const otherCard = screen.getByText('Portfolio Site');

    expect(featuredHeading.compareDocumentPosition(featuredCard)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(featuredCard.compareDocumentPosition(otherHeading)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(otherHeading.compareDocumentPosition(otherCard)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('hides a group that has no projects', async () => {
    fetchProjectsMock.mockResolvedValue(projects.filter((project) => !project.featured));

    renderWithProviders(<ProjectsSection />);

    await screen.findByRole('heading', { name: 'Web and backend' });
    expect(screen.queryByRole('heading', { name: 'IoT and systems' })).not.toBeInTheDocument();
  });

  it('requests the projects in the site language and reloads them when it changes', async () => {
    fetchProjectsMock.mockResolvedValue(projects);

    renderWithProviders(<ProjectsSection />);
    await waitFor(() => expect(fetchProjectsMock).toHaveBeenCalledWith('en'));

    await act(() => i18n.changeLanguage('fr'));

    await waitFor(() => expect(fetchProjectsMock).toHaveBeenCalledWith('fr'));
  });
});
