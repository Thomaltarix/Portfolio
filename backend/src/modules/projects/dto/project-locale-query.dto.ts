import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PROJECT_LOCALES, type ProjectLocale } from '../project-locale';

export class ProjectLocaleQueryDto {
  @ApiPropertyOptional({
    enum: PROJECT_LOCALES,
    default: 'en',
    description:
      'Language of the returned title, summary and content. Falls back to English when a translation is missing.',
  })
  @IsOptional()
  @IsIn(PROJECT_LOCALES)
  lang?: ProjectLocale;
}
