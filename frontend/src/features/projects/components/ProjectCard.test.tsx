import { describe, expect, it } from 'vitest';
import { renderWithProviders, screen } from '@/test/render';
import type { ProjectSummary } from '../types/project.types';
import { ProjectCard } from './ProjectCard';

const project: ProjectSummary = {
  id: 'project-id',
  slug: 'realtime-chat-platform',
  title: 'Realtime Chat Platform',
  summary: 'A chat platform built with NestJS and React.',
  techStack: ['NestJS', 'React', 'PostgreSQL'],
  githubUrl: 'https://github.com/example/chat',
  liveUrl: null,
  featured: true,
};

describe('ProjectCard', () => {
  it('renders the project title and summary', () => {
    renderWithProviders(<ProjectCard project={project} />);

    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(screen.getByText(project.summary)).toBeInTheDocument();
  });

  it('renders a badge for every technology in the tech stack', () => {
    renderWithProviders(<ProjectCard project={project} />);

    for (const tech of project.techStack) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it('links to the project detail page using its slug', () => {
    renderWithProviders(<ProjectCard project={project} />);

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/projects/${project.slug}`,
    );
  });
});
