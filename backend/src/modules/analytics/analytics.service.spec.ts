import { Test } from '@nestjs/testing';
import { PageView } from '@prisma/client';
import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsService } from './analytics.service';

const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function pageView(overrides: Partial<PageView>): PageView {
  return {
    id: 'id',
    path: '/',
    referrer: null,
    country: null,
    device: 'desktop',
    browser: 'Chrome',
    visitorHash: 'hash-a',
    createdAt: new Date(),
    ...overrides,
  };
}

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let analyticsRepository: jest.Mocked<AnalyticsRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: AnalyticsRepository,
          useValue: { create: jest.fn(), findSince: jest.fn() },
        },
      ],
    }).compile();

    service = moduleRef.get(AnalyticsService);
    analyticsRepository = moduleRef.get(AnalyticsRepository);
  });

  describe('track', () => {
    it('never persists the raw IP, only a derived, non-empty visitor hash', async () => {
      await service.track({ path: '/projects' }, '8.8.8.8', DESKTOP_UA);

      const [data] = analyticsRepository.create.mock.calls[0];
      expect(data).not.toHaveProperty('ip');
      expect(data.visitorHash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('derives country and device/browser from the request, not the client', async () => {
      await service.track({ path: '/projects' }, '8.8.8.8', DESKTOP_UA);

      const [data] = analyticsRepository.create.mock.calls[0];
      expect(data.country).toBe('US');
      expect(data.device).toBe('desktop');
      expect(data.browser).toBe('Chrome');
    });

    it('produces the same visitor hash for the same ip/user-agent pair today', async () => {
      await service.track({ path: '/a' }, '1.2.3.4', DESKTOP_UA);
      await service.track({ path: '/b' }, '1.2.3.4', DESKTOP_UA);

      const [first] = analyticsRepository.create.mock.calls[0];
      const [second] = analyticsRepository.create.mock.calls[1];
      expect(first.visitorHash).toBe(second.visitorHash);
    });

    it('produces a different visitor hash for a different ip', async () => {
      await service.track({ path: '/a' }, '1.2.3.4', DESKTOP_UA);
      await service.track({ path: '/a' }, '5.6.7.8', DESKTOP_UA);

      const [first] = analyticsRepository.create.mock.calls[0];
      const [second] = analyticsRepository.create.mock.calls[1];
      expect(first.visitorHash).not.toBe(second.visitorHash);
    });
  });

  describe('getStats', () => {
    it('aggregates total views and unique visitors from raw page views', async () => {
      analyticsRepository.findSince.mockResolvedValue([
        pageView({ visitorHash: 'a', path: '/' }),
        pageView({ visitorHash: 'a', path: '/projects' }),
        pageView({ visitorHash: 'b', path: '/' }),
      ]);

      const stats = await service.getStats(7);

      expect(stats.totalViews).toBe(3);
      expect(stats.uniqueVisitors).toBe(2);
      expect(stats.timeSeries).toHaveLength(7);
    });

    it('ranks top pages by view count', async () => {
      analyticsRepository.findSince.mockResolvedValue([
        pageView({ path: '/' }),
        pageView({ path: '/' }),
        pageView({ path: '/projects' }),
      ]);

      const stats = await service.getStats(7);

      expect(stats.topPages[0]).toEqual({ label: '/', count: 2 });
    });

    it('falls back to a readable label for a missing referrer', async () => {
      analyticsRepository.findSince.mockResolvedValue([
        pageView({ referrer: null }),
      ]);

      const stats = await service.getStats(7);

      expect(stats.topReferrers[0].label).toBe('Direct / none');
    });
  });
});
