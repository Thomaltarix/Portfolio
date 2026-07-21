import { ApiProperty } from '@nestjs/swagger';

export class GithubActivityItemDto {
  @ApiProperty({
    description: 'GitHub event type, e.g. PushEvent, PullRequestEvent',
  })
  type!: string;

  @ApiProperty()
  repositoryName!: string;

  @ApiProperty()
  repositoryUrl!: string;

  @ApiProperty()
  createdAt!: string;
}
