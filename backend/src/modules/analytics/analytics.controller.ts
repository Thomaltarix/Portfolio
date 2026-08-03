import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Headers,
  Ip,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsStatsDto } from './dto/analytics-stats.dto';
import { TrackPageViewDto } from './dto/track-page-view.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @HttpCode(HttpStatus.NO_CONTENT)
  // One beacon per SPA route change from a real visitor — generous enough
  // for legitimate traffic, tight enough to bound abuse of a public endpoint.
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Record a page view (privacy-first: no cookies, no stored IP)',
  })
  async track(
    @Body() dto: TrackPageViewDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string | undefined,
  ): Promise<void> {
    await this.analyticsService.track(dto, ip, userAgent ?? '');
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiQuery({ name: 'days', required: false, example: 7 })
  @ApiOperation({ summary: 'Get aggregated visitor stats for the dashboard' })
  getStats(@Query('days') days?: string): Promise<AnalyticsStatsDto> {
    const parsedDays = Number(days);
    return this.analyticsService.getStats(
      Number.isFinite(parsedDays) && parsedDays > 0 ? parsedDays : 7,
    );
  }
}
