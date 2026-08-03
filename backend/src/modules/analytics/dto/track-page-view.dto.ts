import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class TrackPageViewDto {
  @ApiProperty({ example: '/projects/realtime-chat-platform' })
  @IsString()
  @Length(1, 2048)
  path!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @Length(1, 2048)
  referrer?: string;
}
