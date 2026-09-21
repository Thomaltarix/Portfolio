import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpsertProjectTranslationDto {
  @ApiProperty()
  @IsString()
  @Length(1, 200)
  title!: string;

  @ApiProperty()
  @IsString()
  @Length(1, 500)
  summary!: string;

  @ApiProperty({ description: 'Long-form project write-up, in markdown' })
  @IsString()
  @Length(1, 20_000)
  content!: string;
}
