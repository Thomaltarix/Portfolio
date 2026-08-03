import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Project } from '@prisma/client';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectsRepository: jest.Mocked<ProjectsRepository>;

  const project: Project = {
    id: 'project-id',
    slug: 'realtime-chat-platform',
    title: 'Realtime Chat Platform',
    summary: 'A chat platform.',
    content: '# Realtime Chat Platform\n\nLong-form write-up.',
    techStack: ['NestJS', 'React'],
    githubUrl: 'https://github.com/example/chat',
    liveUrl: null,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: ProjectsRepository,
          useValue: { findAll: jest.fn(), findBySlug: jest.fn() },
        },
      ],
    }).compile();

    service = moduleRef.get(ProjectsService);
    projectsRepository = moduleRef.get(ProjectsRepository);
  });

  describe('findAll', () => {
    it('maps projects to summary DTOs, omitting the markdown content', async () => {
      projectsRepository.findAll.mockResolvedValue([project]);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: project.id,
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          techStack: project.techStack,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl,
          featured: project.featured,
        },
      ]);
      expect(result[0]).not.toHaveProperty('content');
    });
  });

  describe('findBySlug', () => {
    it('maps the project to a detail DTO including its content', async () => {
      projectsRepository.findBySlug.mockResolvedValue(project);

      const result = await service.findBySlug(project.slug);

      expect(projectsRepository.findBySlug).toHaveBeenCalledWith(project.slug);
      expect(result.content).toBe(project.content);
    });

    it('throws NotFoundException when no project matches the slug', async () => {
      projectsRepository.findBySlug.mockResolvedValue(null);

      await expect(service.findBySlug('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
