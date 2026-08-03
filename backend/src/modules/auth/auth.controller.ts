import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { ADMIN_TOKEN_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import { AdminProfileDto } from './dto/admin-profile.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './types/authenticated-request.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  // The one newly-exposed, brute-forceable endpoint — tighter than the
  // global default, matching the contact form's own rate limit.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Log in as the site admin' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AdminProfileDto> {
    const admin = await this.authService.validateCredentials(
      dto.email,
      dto.password,
    );
    res.cookie(
      ADMIN_TOKEN_COOKIE,
      this.authService.signToken(admin),
      this.cookieOptions(),
    );
    return admin;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out the current admin session' })
  logout(@Res({ passthrough: true }) res: Response): { success: true } {
    res.clearCookie(ADMIN_TOKEN_COOKIE, { path: '/' });
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get the currently authenticated admin' })
  me(@Req() req: AuthenticatedRequest): AdminProfileDto {
    return req.user;
  }

  private cookieOptions() {
    const maxAgeSeconds = this.configService.get<number>(
      'jwtExpiresInSeconds',
    )!;
    return {
      httpOnly: true,
      secure: this.configService.get<string>('nodeEnv') === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: maxAgeSeconds * 1000,
    };
  }
}
