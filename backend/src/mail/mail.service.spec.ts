import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { MailService } from './mail.service';

const sendMock = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

describe('MailService', () => {
  let service: MailService;

  const config: Record<string, string> = {
    resendApiKey: 're_test_key',
    contactFromEmail: 'no-reply@thomasboue.com',
  };

  beforeEach(async () => {
    sendMock.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key: string) => config[key]) },
        },
      ],
    }).compile();

    service = moduleRef.get(MailService);
  });

  it('sends the email through Resend using the configured from address', async () => {
    await service.send({
      to: 'visitor@example.com',
      subject: 'Hello',
      html: '<p>Hello</p>',
      replyTo: 'ada@example.com',
    });

    expect(sendMock).toHaveBeenCalledWith({
      from: 'no-reply@thomasboue.com',
      to: 'visitor@example.com',
      subject: 'Hello',
      html: '<p>Hello</p>',
      replyTo: 'ada@example.com',
    });
  });
});
