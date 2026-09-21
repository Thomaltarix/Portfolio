import { Injectable } from '@nestjs/common';
import { Prisma, Project, ProjectTranslation } from '@prisma/client';
import { ProjectLocale, TranslationLocale } from './project-locale';
import { PrismaService } from '../../prisma/prisma.service';

export type ProjectWithTranslations = Prisma.ProjectGetPayload<{
  include: { translations: true };
}>;

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(locale: ProjectLocale): Promise<ProjectWithTranslations[]> {
    // Featured projects lead the list; the rest follow from newest to oldest.
    return this.prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: { translations: { where: { locale } } },
    });
  }

  findBySlug(
    slug: string,
    locale: ProjectLocale,
  ): Promise<ProjectWithTranslations | null> {
    return this.prisma.project.findUnique({
      where: { slug },
      include: { translations: { where: { locale } } },
    });
  }

  findById(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { id } });
  }

  create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.prisma.project.create({ data });
  }

  update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.prisma.project.update({ where: { id }, data });
  }

  upsertTranslation(
    projectId: string,
    locale: TranslationLocale,
    data: { title: string; summary: string; content: string },
  ): Promise<ProjectTranslation> {
    return this.prisma.projectTranslation.upsert({
      where: { projectId_locale: { projectId, locale } },
      update: data,
      create: { projectId, locale, ...data },
    });
  }

  // deleteMany rather than delete: removing a translation that does not exist is not an error.
  async deleteTranslation(
    projectId: string,
    locale: TranslationLocale,
  ): Promise<void> {
    await this.prisma.projectTranslation.deleteMany({
      where: { projectId, locale },
    });
  }

  delete(id: string): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }
}
