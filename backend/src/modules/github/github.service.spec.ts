import { BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;
  let fetchMock: jest.Mock;

  const config: Record<string, unknown> = {
    'github.username': 'thomasboue',
    'github.token': undefined,
    'github.cacheTtlSeconds': 300,
  };

  const githubEvent = {
    type: 'PushEvent',
    created_at: '2026-01-01T00:00:00Z',
    repo: { name: 'thomasboue/portfolio' },
  };

  function jsonResponse(body: unknown, ok = true) {
    return { ok, status: ok ? 200 : 502, json: () => Promise.resolve(body) };
  }

  beforeEach(async () => {
    fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementation() as unknown as jest.Mock;

    const moduleRef = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string) => config[key]) },
        },
      ],
    }).compile();

    service = moduleRef.get(GithubService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('maps GitHub events to activity DTOs', async () => {
    fetchMock.mockResolvedValue(jsonResponse([githubEvent]));

    const result = await service.getActivity();

    expect(result).toEqual([
      {
        type: 'PushEvent',
        repositoryName: 'thomasboue/portfolio',
        repositoryUrl: 'https://github.com/thomasboue/portfolio',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ]);
  });

  it('caches the activity and does not refetch within the TTL', async () => {
    fetchMock.mockResolvedValue(jsonResponse([githubEvent]));

    await service.getActivity();
    await service.getActivity();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refetches once the cache TTL has expired', async () => {
    fetchMock.mockResolvedValue(jsonResponse([githubEvent]));
    const now = jest.spyOn(Date, 'now');
    now.mockReturnValue(0);

    await service.getActivity();

    now.mockReturnValue(301 * 1000);
    await service.getActivity();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws BadGatewayException when the GitHub API request fails', async () => {
    fetchMock.mockResolvedValue(jsonResponse(null, false));

    await expect(service.getActivity()).rejects.toThrow(BadGatewayException);
  });

  it('throws BadGatewayException when the fetch itself rejects', async () => {
    fetchMock.mockRejectedValue(new Error('network error'));

    await expect(service.getActivity()).rejects.toThrow(BadGatewayException);
  });
});
