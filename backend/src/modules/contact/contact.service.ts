import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/mail.service';
import { ContactRepository } from './contact.repository';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async submit(dto: CreateContactMessageDto): Promise<{ id: string }> {
    const message = await this.contactRepository.create(dto);

    // Persistence is the source of truth for the submission; a failed
    // notification email must not fail the request the visitor sees.
    try {
      await this.mailService.send({
        to: this.configService.get<string>('contactNotificationEmail')!,
        // Strip CR/LF from visitor-controlled input before it reaches a header field.
        subject: `New contact message from ${this.stripNewlines(dto.name)}`,
        html: this.buildNotificationHtml(dto),
        replyTo: dto.email,
      });
    } catch (error) {
      const trace = error instanceof Error ? error.stack : String(error);
      this.logger.error('Failed to send contact notification email', trace);
    }

    return { id: message.id };
  }

  private buildNotificationHtml(dto: CreateContactMessageDto): string {
    const name = this.escapeHtml(dto.name);
    const email = this.escapeHtml(dto.email);
    const message = this.escapeHtml(dto.message)
      .replace(/\r\n|\r/g, '\n')
      .replace(/\n/g, '<br>');

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;">
    <div style="background-color:#f4f4f5;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e4e4e7;border-radius:12px;">
        <tr>
          <td style="padding:20px 32px;border-bottom:1px solid #e4e4e7;">
            <span style="font-size:12px;font-weight:600;letter-spacing:0.04em;color:#026fd7;text-transform:uppercase;">New contact message</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <div style="margin-bottom:20px;">
              <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">Name</div>
              <div style="font-size:15px;color:#18181b;">${name}</div>
            </div>
            <div style="margin-bottom:20px;">
              <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">Email</div>
              <div style="font-size:15px;"><a href="mailto:${email}" style="color:#026fd7;text-decoration:none;">${email}</a></div>
            </div>
            <div>
              <div style="font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px;">Message</div>
              <div style="font-size:15px;line-height:1.6;color:#18181b;background-color:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;">${message}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #e4e4e7;">
            <span style="font-size:12px;color:#a1a1aa;">Sent from the contact form on thomasboue.com — reply to this email to respond directly to ${name}.</span>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
  }

  // Visitor-controlled input must not be able to inject extra header lines
  // (e.g. via the email subject) — strip CR/LF before it reaches a header field.
  private stripNewlines(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').trim();
  }

  // Contact-form fields are visitor-controlled; escape before interpolating
  // into the notification email's HTML body.
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
