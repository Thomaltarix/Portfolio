import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContactRepository } from './contact.repository';

// Stated in the public privacy policy — keep in sync.
export const CONTACT_MESSAGE_RETENTION_MONTHS = 12;

@Injectable()
export class ContactRetentionTask {
  private readonly logger = new Logger(ContactRetentionTask.name);

  constructor(private readonly contactRepository: ContactRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async purgeExpiredMessages(): Promise<void> {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - CONTACT_MESSAGE_RETENTION_MONTHS);

    const deleted = await this.contactRepository.deleteOlderThan(cutoff);
    this.logger.log(
      `Purged ${deleted} contact messages older than ${cutoff.toISOString()}`,
    );
  }
}
