import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDetailDto } from './dto/project-detail.dto';
import { ProjectSummaryDto } from './dto/project-summary.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
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

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create a project (admin only)' })
  create(@Body() dto: CreateProjectDto): Promise<ProjectDetailDto> {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update a project (admin only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectDetailDto> {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a project (admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}
