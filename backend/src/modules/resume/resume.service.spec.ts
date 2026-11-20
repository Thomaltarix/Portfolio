import {
  BadRequestException,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ResumeRepository, ResumeSummaryRecord } from './resume.repository';
import { ResumeService, UploadedResumeFile } from './resume.service';

describe('ResumeService', () => {
  let service: ResumeService;
  let resumeRepository: jest.Mocked<ResumeRepository>;

  const pdfFile: UploadedResumeFile = {
    buffer: Buffer.from('%PDF-1.7\n%fake résumé content'),
    mimetype: 'application/pdf',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResumeService,
        {
          provide: ResumeRepository,
          useValue: {
            findContent: jest.fn(),
            findSummaries: jest.fn(),
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ResumeService);
    resumeRepository = moduleRef.get(ResumeRepository);
  });

  describe('getContent', () => {
    it('returns the stored PDF for the locale', async () => {
      const content = new Uint8Array([1, 2, 3]);
      resumeRepository.findContent.mockResolvedValue(content);

      await expect(service.getContent('fr')).resolves.toBe(content);
      expect(resumeRepository.findContent).toHaveBeenCalledWith('fr');
    });

    it('throws NotFoundException when no résumé was uploaded for the locale', async () => {
      resumeRepository.findContent.mockResolvedValue(null);

      await expect(service.getContent('en')).rejects.toThrow(NotFoundException);
    });
  });

  describe('replace', () => {
    it('stores a valid PDF and returns its summary', async () => {
      const summary: ResumeSummaryRecord = {
        locale: 'en',
        sizeBytes: pdfFile.buffer.byteLength,
        updatedAt: new Date(),
      };
      resumeRepository.upsert.mockResolvedValue(summary);

      await expect(service.replace('en', pdfFile)).resolves.toBe(summary);
      expect(resumeRepository.upsert).toHaveBeenCalledWith(
        'en',
        pdfFile.buffer,
      );
    });

    it('rejects a request without a file', async () => {
      await expect(service.replace('en', undefined)).rejects.toThrow(
        BadRequestException,
      );
      expect(resumeRepository.upsert).not.toHaveBeenCalled();
    });

    it('rejects a file declared as something other than a PDF', async () => {
      await expect(
        service.replace('en', { ...pdfFile, mimetype: 'image/png' }),
      ).rejects.toThrow(UnsupportedMediaTypeException);
      expect(resumeRepository.upsert).not.toHaveBeenCalled();
    });

    it('rejects a file declared as PDF whose content is not a PDF', async () => {
      const disguised: UploadedResumeFile = {
        buffer: Buffer.from('<html>not a pdf</html>'),
        mimetype: 'application/pdf',
      };

      await expect(service.replace('fr', disguised)).rejects.toThrow(
        UnsupportedMediaTypeException,
      );
      expect(resumeRepository.upsert).not.toHaveBeenCalled();
    });
  });
});
