import { ApiProperty } from '@nestjs/swagger';

export class DailyCountDto {
  @ApiProperty({ example: '2026-08-01' })
  date!: string;

  @ApiProperty()
  views!: number;

  @ApiProperty()
  uniqueVisitors!: number;
}

export class LabeledCountDto {
  @ApiProperty()
  label!: string;

  @ApiProperty()
  count!: number;
}

export class AnalyticsStatsDto {
  @ApiProperty({ description: 'Size of the reporting window, in days' })
  days!: number;

  @ApiProperty()
  totalViews!: number;

  @ApiProperty({
    description:
      'Approximate — derived from a daily-rotating, non-reversible hash, not a persistent visitor id',
  })
  uniqueVisitors!: number;

  @ApiProperty({ type: [DailyCountDto] })
  timeSeries!: DailyCountDto[];

  @ApiProperty({ type: [LabeledCountDto] })
  topPages!: LabeledCountDto[];

  @ApiProperty({ type: [LabeledCountDto] })
  topReferrers!: LabeledCountDto[];

  @ApiProperty({ type: [LabeledCountDto] })
  deviceBreakdown!: LabeledCountDto[];

  @ApiProperty({ type: [LabeledCountDto] })
  countryBreakdown!: LabeledCountDto[];
}
