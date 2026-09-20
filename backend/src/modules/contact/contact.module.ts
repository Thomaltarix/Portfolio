import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactRepository } from './contact.repository';
import { ContactRetentionTask } from './contact-retention.task';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, ContactRepository, ContactRetentionTask],
})
export class ContactModule {}
