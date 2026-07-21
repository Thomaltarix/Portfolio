import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '@prisma/client';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { ProjectSummaryDto } from './dto/project-summary.dto';
import { ProjectsRepository } from './projects.repository';

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
