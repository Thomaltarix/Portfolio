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

  findAll(): Promise<ContactMessage[]> {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string): Promise<ContactMessage | null> {
    return this.prisma.contactMessage.findUnique({ where: { id } });
  }

  markRead(id: string): Promise<ContactMessage> {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
  }

  delete(id: string): Promise<ContactMessage> {
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
