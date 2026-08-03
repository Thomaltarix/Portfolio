import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  // Explicit rather than the bare @SkipThrottle() — it happens to default to
  // the same thing (our one unnamed throttler resolves to 'default'), but
  // spelling out the name isn't tied to that default surviving future
  // @nestjs/throttler versions.
  @SkipThrottle({ default: true })
  @ApiOperation({
    summary: 'Report whether the API and its database connection are healthy',
  })
  async check(): Promise<{ status: 'ok' }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException(
        'Database connection is not available',
      );
    }
  }
}
