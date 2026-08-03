import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma, Project } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';

function uniqueConstraintError(): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
    code: 'P2002',
    clientVersion: '7.9.0',
  });
}

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
          useValue: {
            findAll: jest.fn(),
            findBySlug: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
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

  describe('create', () => {
    const dto: CreateProjectDto = {
      slug: 'new-project',
      title: 'New Project',
      summary: 'A new project.',
      content: '# New Project',
      techStack: ['TypeScript'],
    };

    it('creates the project and returns a detail DTO', async () => {
      projectsRepository.create.mockResolvedValue(project);

      const result = await service.create(dto);

      expect(projectsRepository.create).toHaveBeenCalledWith(dto);
      expect(result.content).toBe(project.content);
    });

    it('throws ConflictException when the slug is already taken', async () => {
      projectsRepository.create.mockRejectedValue(uniqueConstraintError());

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('throws NotFoundException when the project does not exist', async () => {
      projectsRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('missing-id', { title: 'x' }),
      ).rejects.toThrow(NotFoundException);
      expect(projectsRepository.update).not.toHaveBeenCalled();
    });

    it('updates and returns the project when it exists', async () => {
      projectsRepository.findById.mockResolvedValue(project);
      projectsRepository.update.mockResolvedValue({
        ...project,
        title: 'Updated',
      });

      const result = await service.update(project.id, { title: 'Updated' });

      expect(projectsRepository.update).toHaveBeenCalledWith(project.id, {
        title: 'Updated',
      });
      expect(result.title).toBe('Updated');
    });

    it('throws ConflictException when updating to a slug already taken', async () => {
      projectsRepository.findById.mockResolvedValue(project);
      projectsRepository.update.mockRejectedValue(uniqueConstraintError());

      await expect(
        service.update(project.id, { slug: 'taken' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when the project does not exist', async () => {
      projectsRepository.findById.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(projectsRepository.delete).not.toHaveBeenCalled();
    });

    it('deletes the project when it exists', async () => {
      projectsRepository.findById.mockResolvedValue(project);

      await service.remove(project.id);

      expect(projectsRepository.delete).toHaveBeenCalledWith(project.id);
    });
  });
});
