import { Injectable } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findBySlug(slug: string): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { slug } });
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

  delete(id: string): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }
}
