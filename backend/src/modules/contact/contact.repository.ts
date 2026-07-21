import { Injectable } from '@nestjs/common';
import { ContactMessage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateContactMessageDto): Promise<ContactMessage> {
    return this.prisma.contactMessage.create({ data });
  }
}
