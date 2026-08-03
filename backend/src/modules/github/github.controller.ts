import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GithubActivityItemDto } from './dto/github-activity-item.dto';
import { GithubService } from './github.service';

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('activity')
  // Tighter than the default: caps how often a cache miss can trigger an
  // upstream call against GitHub's own rate-limited API.
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Recent public GitHub activity for the configured account',
  })
  getActivity(): Promise<readonly GithubActivityItemDto[]> {
    return this.githubService.getActivity();
  }
}
