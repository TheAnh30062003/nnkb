import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    Req,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { ProjectTaskService } from './project-task.service';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { Roles } from '../../role/roles.decorator';
  import { StatusRoles } from '../../role/status.decorator';
  import { ProjectTask } from '@prisma/client';
  import { CreateProjectTaskDto } from './dto/CreateProjectTask';
  import { UpdateProjectTaskDto } from './dto/UpdateProjectTask';
  import { GetProjectTasksDto } from './dto/GetProjectTask';
  import { DeleteProjectTaskDto } from './dto/DeleteProjectTask';
  import { UserRoles ,UserStatus  } from '../../user/user.types';
  import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
  
  @ApiBearerAuth('JWT-auth')
  @ApiTags('ProjectTasks')
  @Controller('project-tasks')
  @StatusRoles(UserStatus.ACTIVE)
  export class ProjectTaskController {
    constructor(private readonly projectTaskService: ProjectTaskService) {}
  
    // Create a new ProjectTask relationship
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @UseGuards(JwtAuthGuard)
    @Post()
    async createProjectTask(@Body() createProjectTaskDto: CreateProjectTaskDto, @Req() req: any) {
      const creatorEmail = req.user?.email; // Lấy email từ token
      return this.projectTaskService.createProjectTask(createProjectTaskDto, creatorEmail);
    }
  
    // Get a specific ProjectTask by ID
    @Get(':id')
    getProjectTaskById(@Param('id', ParseIntPipe) id: number) {
      return this.projectTaskService.getProjectTaskById(id);
    }
  
    // Get a list of ProjectTasks with optional filtering and pagination
    @Get()
    getProjectTasks(
      @Query('pageNumber') pageNumber: number = 1,
      @Query('pageSize') pageSize: number = 10,
      @Query('keyword') keyword?: string
    ) {
      return this.projectTaskService.getProjectTasks(pageNumber, pageSize, keyword);
    }
  
    // Update an existing ProjectTask relationship
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @Put(':id')
    updateProjectTask(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateProjectTaskDto: UpdateProjectTaskDto
    ) {
      return this.projectTaskService.updateProjectTask(id, updateProjectTaskDto);
    }
  
    // Delete a ProjectTask relationship by ID
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @Delete(':id')
    deleteProjectTask(@Param('id', ParseIntPipe) id: number) {
      return this.projectTaskService.deleteProjectTask(id);
    }
  }
  