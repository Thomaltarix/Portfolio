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
import { UpsertProjectTranslationDto } from './dto/upsert-project-translation.dto';
import {
  DEFAULT_PROJECT_LOCALE,
  ProjectLocale,
  TranslationLocale,
} from './project-locale';
import {
  ProjectsRepository,
  ProjectWithTranslations,
} from './projects.repository';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async findAll(
    locale: ProjectLocale = DEFAULT_PROJECT_LOCALE,
  ): Promise<ProjectSummaryDto[]> {
    const projects = await this.projectsRepository.findAll(locale);
    return projects.map(toSummaryDto);
  }

  async findBySlug(
    slug: string,
    locale: ProjectLocale = DEFAULT_PROJECT_LOCALE,
  ): Promise<ProjectDetailDto> {
    const project = await this.projectsRepository.findBySlug(slug, locale);
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

  async upsertTranslation(
    id: string,
    locale: TranslationLocale,
    dto: UpsertProjectTranslationDto,
  ): Promise<ProjectDetailDto> {
    const project = await this.getOrThrow(id);
    const translation = await this.projectsRepository.upsertTranslation(
      id,
      locale,
      dto,
    );
    return toDetailDto({ ...project, translations: [translation] });
  }

  async deleteTranslation(
    id: string,
    locale: TranslationLocale,
  ): Promise<void> {
    await this.getOrThrow(id);
    await this.projectsRepository.deleteTranslation(id, locale);
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

// A project's text fields, in the requested language when a translation exists
// and in the default language otherwise. Writes always target the default language.
type LocalisableProject = Project & {
  readonly translations?: ProjectWithTranslations['translations'];
};

function toSummaryDto(project: LocalisableProject): ProjectSummaryDto {
  const translation = project.translations?.[0];
  return {
    id: project.id,
    slug: project.slug,
    title: translation?.title ?? project.title,
    summary: translation?.summary ?? project.summary,
    techStack: project.techStack,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
  };
}

function toDetailDto(project: LocalisableProject): ProjectDetailDto {
  const translation = project.translations?.[0];
  return {
    ...toSummaryDto(project),
    content: translation?.content ?? project.content,
    locale: translation
      ? (translation.locale as ProjectLocale)
      : DEFAULT_PROJECT_LOCALE,
  };
}
