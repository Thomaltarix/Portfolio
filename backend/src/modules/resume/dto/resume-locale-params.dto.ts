import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { RESUME_LOCALES, type ResumeLocale } from '../resume-locale';

export class ResumeLocaleParamsDto {
  @ApiProperty({ enum: RESUME_LOCALES })
  @IsIn(RESUME_LOCALES)
  locale!: ResumeLocale;
}
