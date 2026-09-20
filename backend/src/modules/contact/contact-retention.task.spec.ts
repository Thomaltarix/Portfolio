import { Test } from '@nestjs/testing';
import { ContactRetentionTask } from './contact-retention.task';
import { ContactRepository } from './contact.repository';

describe('ContactRetentionTask', () => {
  it('deletes messages older than 12 months', async () => {
    const contactRepository = { deleteOlderThan: jest.fn().mockResolvedValue(2) };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ContactRetentionTask,
        { provide: ContactRepository, useValue: contactRepository },
      ],
    }).compile();

    await moduleRef.get(ContactRetentionTask).purgeExpiredMessages();

    const cutoff: Date = contactRepository.deleteOlderThan.mock.calls[0][0];
    const monthsAgo =
      (Date.now() - cutoff.getTime()) / (1000 * 60 * 60 * 24 * 30);
    expect(monthsAgo).toBeGreaterThan(11.5);
    expect(monthsAgo).toBeLessThan(12.5);
  });
});
