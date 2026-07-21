import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GithubActivityItemDto } from './dto/github-activity-item.dto';
import { GithubService } from './github.service';

@ApiTags('github')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('activity')
  @ApiOperation({
    summary: 'Recent public GitHub activity for the configured account',
  })
  getActivity(): Promise<readonly GithubActivityItemDto[]> {
    return this.githubService.getActivity();
  }
}
