import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ContactMessage } from '@prisma/client';
import { MailService } from '../../mail/mail.service';
import { ContactRepository } from './contact.repository';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

describe('ContactService', () => {
  let service: ContactService;
  let contactRepository: jest.Mocked<ContactRepository>;
  let mailService: jest.Mocked<MailService>;

  const dto: CreateContactMessageDto = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Hello, I would like to get in touch.',
  };

  const persistedMessage = { id: 'message-id' } as ContactMessage;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: ContactRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            markRead: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: { send: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('notifications@example.com'),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ContactService);
    contactRepository = moduleRef.get(ContactRepository);
    mailService = moduleRef.get(MailService);

    contactRepository.create.mockResolvedValue(persistedMessage);
  });

  it('persists the message and returns its id', async () => {
    const result = await service.submit(dto);

    expect(contactRepository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: persistedMessage.id });
  });

  it('sends a notification email using the visitor address as reply-to', async () => {
    await service.submit(dto);

    const [params] = mailService.send.mock.calls[0];
    expect(params.to).toBe('notifications@example.com');
    expect(params.replyTo).toBe(dto.email);
    expect(params.subject).toContain(dto.name);
  });

  it('strips CR/LF from the visitor name before it reaches the email subject', async () => {
    await service.submit({ ...dto, name: 'Ada\r\nBcc: attacker@evil.com' });

    const [{ subject }] = mailService.send.mock.calls[0];
    expect(subject).not.toMatch(/[\r\n]/);
  });

  it('escapes visitor-controlled input in the notification email body', async () => {
    await service.submit({ ...dto, name: '<script>alert(1)</script>' });

    const [{ html }] = mailService.send.mock.calls[0];
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('does not fail the request when the notification email fails to send', async () => {
    mailService.send.mockRejectedValue(new Error('Resend is down'));

    await expect(service.submit(dto)).resolves.toEqual({
      id: persistedMessage.id,
    });
  });

  describe('findAll', () => {
    it('returns every message from the repository', async () => {
      const messages = [{ id: '1' } as ContactMessage];
      contactRepository.findAll.mockResolvedValue(messages);

      await expect(service.findAll()).resolves.toBe(messages);
    });
  });

  describe('markRead', () => {
    it('throws NotFoundException when the message does not exist', async () => {
      contactRepository.findById.mockResolvedValue(null);

      await expect(service.markRead('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(contactRepository.markRead).not.toHaveBeenCalled();
    });

    it('marks the message as read when it exists', async () => {
      const message = { id: 'message-id', read: false } as ContactMessage;
      contactRepository.findById.mockResolvedValue(message);
      contactRepository.markRead.mockResolvedValue({ ...message, read: true });

      const result = await service.markRead(message.id);

      expect(contactRepository.markRead).toHaveBeenCalledWith(message.id);
      expect(result.read).toBe(true);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when the message does not exist', async () => {
      contactRepository.findById.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(contactRepository.delete).not.toHaveBeenCalled();
    });

    it('deletes the message when it exists', async () => {
      const message = { id: 'message-id' } as ContactMessage;
      contactRepository.findById.mockResolvedValue(message);

      await service.remove(message.id);

      expect(contactRepository.delete).toHaveBeenCalledWith(message.id);
    });
  });
});
