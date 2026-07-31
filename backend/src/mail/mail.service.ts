import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface SendEmailParams {
  readonly to: string;
  readonly subject: string;
  readonly html: string;
}

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(configService: ConfigService) {
    this.resend = new Resend(configService.get<string>('resendApiKey'));
    this.fromEmail = configService.get<string>('contactFromEmail')!;
  }

  async send(params: SendEmailParams): Promise<void> {
    await this.resend.emails.send({
      from: this.fromEmail,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  }
}
