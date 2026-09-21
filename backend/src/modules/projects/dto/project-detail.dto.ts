import { ApiProperty } from '@nestjs/swagger';
import { PROJECT_LOCALES, type ProjectLocale } from '../project-locale';
import { ProjectSummaryDto } from './project-summary.dto';

export class ProjectDetailDto extends ProjectSummaryDto {
  @ApiProperty({ description: 'Long-form project write-up, in markdown' })
  content!: string;

  @ApiProperty({
    enum: PROJECT_LOCALES,
    description:
      'Language of the returned text. Differs from the requested one when no translation exists and the default language was served.',
  })
  locale!: ProjectLocale;
}
