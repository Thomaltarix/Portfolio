import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';
import { TRANSLATION_LOCALES, type TranslationLocale } from '../project-locale';

export class ProjectTranslationParamsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiProperty({ enum: TRANSLATION_LOCALES })
  @IsIn(TRANSLATION_LOCALES)
  locale!: TranslationLocale;
}
