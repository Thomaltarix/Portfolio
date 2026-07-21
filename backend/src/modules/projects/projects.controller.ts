import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { ProjectSummaryDto } from './dto/project-summary.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  findAll(): Promise<ProjectSummaryDto[]> {
    return this.projectsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single project by slug' })
  @ApiParam({ name: 'slug', example: 'realtime-chat-platform' })
  findBySlug(@Param('slug') slug: string): Promise<ProjectDetailDto> {
    return this.projectsService.findBySlug(slug);
  }
}
