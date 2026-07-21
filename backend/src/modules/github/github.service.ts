import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubActivityItemDto } from './dto/github-activity-item.dto';

interface GithubEvent {
  readonly type: string;
  readonly created_at: string;
  readonly repo: {
    readonly name: string;
  };
}

interface CacheEntry {
  readonly data: readonly GithubActivityItemDto[];
  readonly expiresAt: number;
}

@Injectable()
export class GithubService {
  private readonly cache = new Map<string, CacheEntry>();

  constructor(private readonly configService: ConfigService) {}

  async getActivity(): Promise<readonly GithubActivityItemDto[]> {
    const username = this.configService.get<string>('github.username')!;
    const cached = this.cache.get(username);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    let data: readonly GithubActivityItemDto[];
    try {
      data = await this.fetchActivity(username);
    } catch {
      throw new BadGatewayException(
        'Unable to fetch GitHub activity right now',
      );
    }

    const ttlSeconds = this.configService.get<number>(
      'github.cacheTtlSeconds',
    )!;
    this.cache.set(username, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return data;
  }

  private async fetchActivity(
    username: string,
  ): Promise<readonly GithubActivityItemDto[]> {
    const token = this.configService.get<string>('github.token');
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed with status ${response.status}`,
      );
    }

    const events = (await response.json()) as GithubEvent[];
    return events.slice(0, 30).map(toActivityItemDto);
  }
}

function toActivityItemDto(event: GithubEvent): GithubActivityItemDto {
  return {
    type: event.type,
    repositoryName: event.repo.name,
    repositoryUrl: `https://github.com/${event.repo.name}`,
    createdAt: event.created_at,
  };
}
