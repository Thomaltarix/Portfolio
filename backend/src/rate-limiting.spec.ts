import { APP_GUARD } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { ContactController } from './modules/contact/contact.controller';
import { ContactService } from './modules/contact/contact.service';
import { GithubController } from './modules/github/github.controller';
import { GithubService } from './modules/github/github.service';
import { HealthController } from './modules/health/health.controller';
import { PrismaService } from './prisma/prisma.service';

describe('Rate limiting', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }])],
      controllers: [ContactController, GithubController, HealthController],
      providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        {
          provide: ContactService,
          useValue: {
            submit: jest.fn().mockResolvedValue({ id: 'message-id' }),
          },
        },
        {
          provide: GithubService,
          useValue: { getActivity: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: PrismaService,
          useValue: { $queryRaw: jest.fn().mockResolvedValue([{ ok: 1 }]) },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    // Mirrors main.ts: without this, requests carrying a spoofed/forwarded
    // X-Forwarded-For are tracked by the real connecting socket instead,
    // which is exactly the bug the "per-client IP" test below guards against.
    app.set('trust proxy', 1);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows up to 5 contact submissions per minute and rejects the 6th', async () => {
    const dto = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello, I would like to get in touch.',
    };

    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer()).post('/contact').send(dto).expect(201);
    }

    await request(app.getHttpServer()).post('/contact').send(dto).expect(429);
  });

  it('allows up to 20 GitHub activity requests per minute and rejects the 21st', async () => {
    for (let i = 0; i < 20; i++) {
      await request(app.getHttpServer()).get('/github/activity').expect(200);
    }

    await request(app.getHttpServer()).get('/github/activity').expect(429);
  });

  it('never throttles the health check', async () => {
    // Deliberately exceeds the global default (60/min): a lower count would
    // pass even if @SkipThrottle() were silently broken, since it'd still be
    // under the default limit that applies to every other route.
    for (let i = 0; i < 65; i++) {
      await request(app.getHttpServer()).get('/health').expect(200);
    }
  });

  it('tracks the limit per real client IP, not per connecting socket', async () => {
    const dto = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello, I would like to get in touch.',
    };

    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/contact')
        .set('X-Forwarded-For', '203.0.113.10')
        .send(dto)
        .expect(201);
    }
    await request(app.getHttpServer())
      .post('/contact')
      .set('X-Forwarded-For', '203.0.113.10')
      .send(dto)
      .expect(429);

    // A different client, behind the same proxy, must not inherit the first
    // client's exhausted count — this is what `app.set('trust proxy', 1)`
    // guarantees by making Express honor X-Forwarded-For.
    await request(app.getHttpServer())
      .post('/contact')
      .set('X-Forwarded-For', '203.0.113.20')
      .send(dto)
      .expect(201);
  });
});
