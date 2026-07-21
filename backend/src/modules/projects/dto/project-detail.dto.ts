import { ApiProperty } from '@nestjs/swagger';
import { ProjectSummaryDto } from './project-summary.dto';

export class ProjectDetailDto extends ProjectSummaryDto {
  @ApiProperty({ description: 'Long-form project write-up, in markdown' })
  content!: string;
}
