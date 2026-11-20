import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { ResumeLocale } from './resume-locale';

export interface ResumeSummaryRecord {
  readonly locale: ResumeLocale;
  readonly sizeBytes: number;
  readonly updatedAt: Date;
}

const SUMMARY_FIELDS = {
  locale: true,
  sizeBytes: true,
  updatedAt: true,
} as const;

@Injectable()
export class ResumeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findContent(locale: ResumeLocale): Promise<Uint8Array | null> {
    const resume = await this.prisma.resume.findUnique({
      where: { locale },
      select: { content: true },
    });
    return resume?.content ?? null;
  }

  async findSummaries(): Promise<ResumeSummaryRecord[]> {
    const rows = await this.prisma.resume.findMany({
      select: SUMMARY_FIELDS,
      orderBy: { locale: 'asc' },
    });
    // Safe: rows are only ever written by upsert() below, keyed by a ResumeLocale.
    return rows as ResumeSummaryRecord[];
  }

  async upsert(
    locale: ResumeLocale,
    content: Uint8Array<ArrayBuffer>,
  ): Promise<ResumeSummaryRecord> {
    const data = { content, sizeBytes: content.byteLength };
    const row = await this.prisma.resume.upsert({
      where: { locale },
      create: { locale, ...data },
      update: data,
      select: SUMMARY_FIELDS,
    });
    return { ...row, locale };
  }
}
