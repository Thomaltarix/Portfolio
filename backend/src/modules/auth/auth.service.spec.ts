import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Admin } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AdminRepository } from './admin.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let adminRepository: jest.Mocked<AdminRepository>;
  let jwtService: jest.Mocked<JwtService>;

  const password = 'correct-horse-battery-staple';
  const admin: Admin = {
    id: 'admin-id',
    email: 'admin@example.com',
    // Low cost factor — this only needs to be fast in tests, not secure.
    passwordHash: bcrypt.hashSync(password, 4),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AdminRepository, useValue: { findByEmail: jest.fn() } },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('signed-token') },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    adminRepository = moduleRef.get(AdminRepository);
    jwtService = moduleRef.get(JwtService);
  });

  describe('validateCredentials', () => {
    it('returns the admin profile when the password matches', async () => {
      adminRepository.findByEmail.mockResolvedValue(admin);

      const result = await service.validateCredentials(admin.email, password);

      expect(result).toEqual({ id: admin.id, email: admin.email });
    });

    it('throws UnauthorizedException when the password does not match', async () => {
      adminRepository.findByEmail.mockResolvedValue(admin);

      await expect(
        service.validateCredentials(admin.email, 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when no admin matches the email', async () => {
      adminRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.validateCredentials('missing@example.com', password),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signToken', () => {
    it('signs a JWT payload with the admin id as subject', () => {
      const token = service.signToken({ id: admin.id, email: admin.email });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: admin.id,
        email: admin.email,
      });
      expect(token).toBe('signed-token');
    });
  });
});
