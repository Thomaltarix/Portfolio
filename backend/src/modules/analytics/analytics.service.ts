import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import * as geoip from 'geoip-lite';
import { PageView } from '@prisma/client';
import { UAParser } from 'ua-parser-js';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsStatsDto, LabeledCountDto } from './dto/analytics-stats.dto';
import { TrackPageViewDto } from './dto/track-page-view.dto';

const DAY_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async track(
    dto: TrackPageViewDto,
    ip: string,
    userAgent: string,
  ): Promise<void> {
    const device = new UAParser(userAgent).getResult();

    await this.analyticsRepository.create({
      path: dto.path,
      referrer: dto.referrer ?? null,
      country: geoip.lookup(ip)?.country ?? null,
      device: device.device.type ?? 'desktop',
      browser: device.browser.name ?? null,
      visitorHash: this.hashVisitor(ip, userAgent),
    });
  }

  async getStats(days: number): Promise<AnalyticsStatsDto> {
    const since = new Date(Date.now() - days * DAY_MS);
    const views = await this.analyticsRepository.findSince(since);

    return {
      days,
      totalViews: views.length,
      uniqueVisitors: new Set(views.map((view) => view.visitorHash)).size,
      timeSeries: this.buildTimeSeries(views, days),
      topPages: this.topCounts(views, (view) => view.path, 10),
      topReferrers: this.topCounts(
        views,
        (view) => view.referrer,
        10,
        'Direct / none',
      ),
      deviceBreakdown: this.topCounts(
        views,
        (view) => view.device,
        5,
        'Unknown',
      ),
      countryBreakdown: this.topCounts(
        views,
        (view) => view.country,
        10,
        'Unknown',
      ),
    };
  }

  // A daily-rotating, publicly-derivable salt (the UTC date itself) is enough
  // to prevent the same visitor from being linkable across different days —
  // the goal is "no persistent visitor id", not resisting an attacker who
  // already controls this database (they could just recompute the hash for
  // any IP they're testing, the same as we can).
  private hashVisitor(ip: string, userAgent: string): string {
    const daySalt = new Date().toISOString().slice(0, 10);
    return createHash('sha256')
      .update(`${ip}:${userAgent}:${daySalt}`)
      .digest('hex');
  }

  private buildTimeSeries(
    views: PageView[],
    days: number,
  ): AnalyticsStatsDto['timeSeries'] {
    const byDate = new Map<string, { views: number; visitors: Set<string> }>();

    for (const view of views) {
      const date = view.createdAt.toISOString().slice(0, 10);
      const bucket = byDate.get(date) ?? {
        views: 0,
        visitors: new Set<string>(),
      };
      bucket.views += 1;
      bucket.visitors.add(view.visitorHash);
      byDate.set(date, bucket);
    }

    const series: AnalyticsStatsDto['timeSeries'] = [];
    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = new Date(Date.now() - offset * DAY_MS)
        .toISOString()
        .slice(0, 10);
      const bucket = byDate.get(date);
      series.push({
        date,
        views: bucket?.views ?? 0,
        uniqueVisitors: bucket?.visitors.size ?? 0,
      });
    }
    return series;
  }

  private topCounts(
    views: PageView[],
    extract: (view: PageView) => string | null,
    limit: number,
    fallbackLabel = 'Unknown',
  ): LabeledCountDto[] {
    const counts = new Map<string, number>();
    for (const view of views) {
      const label = extract(view) || fallbackLabel;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([label, count]) => ({ label, count }));
  }
}
