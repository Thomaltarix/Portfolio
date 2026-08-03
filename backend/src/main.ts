import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ADMIN_TOKEN_COOKIE } from './modules/auth/auth.constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // In production the app sits behind exactly one Nginx reverse proxy (see
  // architecture.md), which sets X-Forwarded-For. Without this, Express
  // ignores that header and req.ip resolves to Nginx's address for every
  // request — collapsing ThrottlerGuard's per-IP rate limit into one shared
  // bucket for all visitors.
  app.set('trust proxy', 1);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // credentials: true is required for the admin JWT cookie to round-trip —
  // the frontend fetches with credentials: 'include' (see api-client.ts).
  app.enableCors({
    origin: configService.get<string>('corsOrigin'),
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription(
      'Backend API powering the portfolio: projects, contact form, GitHub activity, and the admin dashboard',
    )
    .setVersion('1.0')
    .addCookieAuth(ADMIN_TOKEN_COOKIE)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('port')!;
  await app.listen(port);
}

void bootstrap();
