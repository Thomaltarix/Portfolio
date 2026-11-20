import { ApiProperty } from '@nestjs/swagger';
import { RESUME_LOCALES, type ResumeLocale } from '../resume-locale';

export class ResumeSummaryDto {
  @ApiProperty({ enum: RESUME_LOCALES })
  locale!: ResumeLocale;

  @ApiProperty()
  sizeBytes!: number;

  @ApiProperty()
  updatedAt!: Date;
}
