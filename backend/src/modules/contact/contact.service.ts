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
        subject: `New contact message from ${dto.name}`,
        html: this.buildNotificationHtml(dto),
      });
    } catch (error) {
      this.logger.error('Failed to send contact notification email', error);
    }

    return { id: message.id };
  }

  private buildNotificationHtml(dto: CreateContactMessageDto): string {
    const name = this.escapeHtml(dto.name);
    const email = this.escapeHtml(dto.email);
    const message = this.escapeHtml(dto.message).replace(/\n/g, '<br>');

    return `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
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
