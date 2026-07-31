import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { MailModule } from './mail/mail.module';
import { ContactModule } from './modules/contact/contact.module';
import { GithubModule } from './modules/github/github.module';
import { HealthModule } from './modules/health/health.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    MailModule,
    HealthModule,
    ProjectsModule,
    ContactModule,
    GithubModule,
  ],
})
export class AppModule {}
