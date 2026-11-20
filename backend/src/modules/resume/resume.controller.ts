import {
  Controller,
  Get,
  Header,
  Param,
  Put,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResumeLocaleParamsDto } from './dto/resume-locale-params.dto';
import { ResumeSummaryDto } from './dto/resume-summary.dto';
import { RESUME_FILE_NAMES, RESUME_MAX_SIZE_BYTES } from './resume-locale';
import { ResumeService, type UploadedResumeFile } from './resume.service';

@ApiTags('resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'List uploaded résumés without their content (admin only)',
  })
  findSummaries(): Promise<ResumeSummaryDto[]> {
    return this.resumeService.findSummaries();
  }

  @Get(':locale')
  // Revalidated on every download so a replaced résumé is served immediately.
  @Header('Cache-Control', 'no-cache')
  @ApiProduces('application/pdf')
  @ApiOperation({ summary: 'Download the résumé PDF for a language' })
  async download(
    @Param() { locale }: ResumeLocaleParamsDto,
  ): Promise<StreamableFile> {
    const content = await this.resumeService.getContent(locale);
    return new StreamableFile(content, {
      type: 'application/pdf',
      disposition: `attachment; filename="${RESUME_FILE_NAMES[locale]}"`,
      length: content.byteLength,
    });
  }

  @Put(':locale')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: RESUME_MAX_SIZE_BYTES, files: 1 },
    }),
  )
  @ApiCookieAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({
    summary: 'Replace the résumé PDF for a language (admin only)',
  })
  replace(
    @Param() { locale }: ResumeLocaleParamsDto,
    @UploadedFile() file: UploadedResumeFile | undefined,
  ): Promise<ResumeSummaryDto> {
    return this.resumeService.replace(locale, file);
  }
}
