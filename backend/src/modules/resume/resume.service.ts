import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import type { ResumeLocale } from './resume-locale';
import { ResumeRepository, ResumeSummaryRecord } from './resume.repository';

// The subset of Multer's file object this module relies on.
export interface UploadedResumeFile {
  readonly buffer: Buffer<ArrayBuffer>;
  readonly mimetype: string;
}

const PDF_MIME_TYPE = 'application/pdf';
const PDF_SIGNATURE = Buffer.from('%PDF-');

@Injectable()
export class ResumeService {
  constructor(private readonly resumeRepository: ResumeRepository) {}

  async getContent(locale: ResumeLocale): Promise<Uint8Array> {
    const content = await this.resumeRepository.findContent(locale);
    if (!content) {
      throw new NotFoundException(`No résumé uploaded for locale "${locale}"`);
    }
    return content;
  }

  findSummaries(): Promise<ResumeSummaryRecord[]> {
    return this.resumeRepository.findSummaries();
  }

  async replace(
    locale: ResumeLocale,
    file: UploadedResumeFile | undefined,
  ): Promise<ResumeSummaryRecord> {
    if (!file) {
      throw new BadRequestException(
        'A PDF file is required in the "file" field',
      );
    }
    // The declared MIME type comes from the client, so the file's own
    // signature is what actually proves it is a PDF.
    if (file.mimetype !== PDF_MIME_TYPE || !this.hasPdfSignature(file.buffer)) {
      throw new UnsupportedMediaTypeException('Only PDF files are accepted');
    }
    return this.resumeRepository.upsert(locale, file.buffer);
  }

  private hasPdfSignature(buffer: Buffer): boolean {
    return buffer.subarray(0, PDF_SIGNATURE.length).equals(PDF_SIGNATURE);
  }
}
