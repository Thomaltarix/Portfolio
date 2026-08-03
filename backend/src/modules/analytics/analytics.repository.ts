import { Injectable } from '@nestjs/common';
import { PageView } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreatePageViewData {
  path: string;
  referrer: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  visitorHash: string;
}

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePageViewData): Promise<PageView> {
    return this.prisma.pageView.create({ data });
  }

  // The dashboard's reporting window is small enough (days, not years) that
  // aggregating in-memory in the service is simpler than several separate
  // Prisma groupBy queries — see analytics.service.ts.
  findSince(since: Date): Promise<PageView[]> {
    return this.prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
    });
  }
}
