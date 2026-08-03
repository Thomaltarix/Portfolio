import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'realtime-chat-platform' })
  @IsString()
  @Length(1, 100)
  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase, alphanumeric, and hyphen-separated',
  })
  slug!: string;

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

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  techStack!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  liveUrl?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
