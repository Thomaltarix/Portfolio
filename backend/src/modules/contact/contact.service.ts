import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async submit(dto: CreateContactMessageDto): Promise<{ id: string }> {
    const message = await this.contactRepository.create(dto);
    return { id: message.id };
  }
}
