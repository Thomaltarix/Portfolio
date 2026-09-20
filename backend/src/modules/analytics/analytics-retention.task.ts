import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsRepository } from './analytics.repository';

// 13 months is the maximum retention the CNIL allows for audience-measurement
// data exempt from consent. Stated in the public privacy policy — keep in sync.
export const PAGE_VIEW_RETENTION_MONTHS = 13;

@Injectable()
export class AnalyticsRetentionTask {
  private readonly logger = new Logger(AnalyticsRetentionTask.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async purgeExpiredPageViews(): Promise<void> {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - PAGE_VIEW_RETENTION_MONTHS);

    const deleted = await this.analyticsRepository.deleteOlderThan(cutoff);
    this.logger.log(
      `Purged ${deleted} page views older than ${cutoff.toISOString()}`,
    );
  }
}
