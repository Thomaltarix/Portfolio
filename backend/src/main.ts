import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // In production the app sits behind exactly one Nginx reverse proxy (see
  // architecture.md), which sets X-Forwarded-For. Without this, Express
  // ignores that header and req.ip resolves to Nginx's address for every
  // request — collapsing ThrottlerGuard's per-IP rate limit into one shared
  // bucket for all visitors.
  app.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({ origin: configService.get<string>('corsOrigin') });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription(
      'Backend API powering the portfolio: projects, contact form, and GitHub activity',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('port')!;
  await app.listen(port);
}

void bootstrap();
