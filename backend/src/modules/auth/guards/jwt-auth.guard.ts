import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Reused across modules (projects, contact, analytics) to protect admin-only
// routes — a plain class import, not a Nest module dependency, so those
// modules stay independent of AuthModule (see claude/backend.md).
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
