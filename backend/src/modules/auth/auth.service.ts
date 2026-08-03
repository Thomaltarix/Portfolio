import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminRepository } from './admin.repository';
import { AdminProfile } from './types/admin-profile.type';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<AdminProfile> {
    const admin = await this.adminRepository.findByEmail(email);
    // Same error for "no such admin" and "wrong password" — don't reveal
    // which one it was, since that would let an attacker enumerate emails.
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: admin.id, email: admin.email };
  }

  signToken(admin: AdminProfile): string {
    const payload: JwtPayload = { sub: admin.id, email: admin.email };
    return this.jwtService.sign(payload);
  }
}
