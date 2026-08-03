import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { ADMIN_TOKEN_COOKIE } from '../auth.constants';
import { AdminProfile } from '../types/admin-profile.type';
import { JwtPayload } from '../types/jwt-payload.type';

function cookieExtractor(req: Request): string | null {
  return (req.cookies?.[ADMIN_TOKEN_COOKIE] as string | undefined) ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configService.get<string>('jwtSecret')!,
    });
  }

  validate(payload: JwtPayload): AdminProfile {
    return { id: payload.sub, email: payload.email };
  }
}
