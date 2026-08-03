import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { ProjectSummaryDto } from './dto/project-summary.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async findAll(): Promise<ProjectSummaryDto[]> {
    const projects = await this.projectsRepository.findAll();
    return projects.map(toSummaryDto);
  }

  async findBySlug(slug: string): Promise<ProjectDetailDto> {
    const project = await this.projectsRepository.findBySlug(slug);
    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }
    return toDetailDto(project);
  }

  async create(dto: CreateProjectDto): Promise<ProjectDetailDto> {
    try {
      const project = await this.projectsRepository.create(dto);
      return toDetailDto(project);
    } catch (error) {
      throw this.mapWriteError(error, dto.slug);
    }
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectDetailDto> {
    await this.getOrThrow(id);
    try {
      const project = await this.projectsRepository.update(id, dto);
      return toDetailDto(project);
    } catch (error) {
      throw this.mapWriteError(error, dto.slug);
    }
  }

  async remove(id: string): Promise<void> {
    await this.getOrThrow(id);
    await this.projectsRepository.delete(id);
  }

  private async getOrThrow(id: string): Promise<Project> {
    const project = await this.projectsRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
    return project;
  }

  private mapWriteError(error: unknown, slug: string | undefined): unknown {
    const isUniqueViolation =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_VIOLATION;
    return isUniqueViolation
      ? new ConflictException(`A project with slug "${slug}" already exists`)
      : error;
  }
}

function toSummaryDto(project: Project): ProjectSummaryDto {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    techStack: project.techStack,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
  };
}

function toDetailDto(project: Project): ProjectDetailDto {
  return {
    ...toSummaryDto(project),
    content: project.content,
  };
}
