import { ApiProperty } from '@nestjs/swagger';

export class ProjectSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  summary!: string;

  @ApiProperty({ type: [String] })
  techStack!: readonly string[];

  @ApiProperty({ nullable: true })
  githubUrl!: string | null;

  @ApiProperty({ nullable: true })
  liveUrl!: string | null;

  @ApiProperty()
  featured!: boolean;
}
