import { Test } from '@nestjs/testing';
import { ContactRetentionTask } from './contact-retention.task';
import { ContactRepository } from './contact.repository';

describe('ContactRetentionTask', () => {
  it('deletes messages older than 12 months', async () => {
    const deleteOlderThan = jest
      .fn<Promise<number>, [Date]>()
      .mockResolvedValue(2);
    const contactRepository = { deleteOlderThan };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ContactRetentionTask,
        { provide: ContactRepository, useValue: contactRepository },
      ],
    }).compile();

    await moduleRef.get(ContactRetentionTask).purgeExpiredMessages();

    const [cutoff] = deleteOlderThan.mock.calls[0];
    const monthsAgo =
      (Date.now() - cutoff.getTime()) / (1000 * 60 * 60 * 24 * 30);
    expect(monthsAgo).toBeGreaterThan(11.5);
    expect(monthsAgo).toBeLessThan(12.5);
  });
});
