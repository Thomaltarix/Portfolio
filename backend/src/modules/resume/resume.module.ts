import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeRepository } from './resume.repository';
import { ResumeService } from './resume.service';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, ResumeRepository],
})
export class ResumeModule {}
