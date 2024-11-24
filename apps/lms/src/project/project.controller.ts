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
  } from "@nestjs/common";
  import { ProjectService } from "./project.service";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  import { Roles } from "../role/roles.decorator";
  import { StatusRoles } from "../role/status.decorator";
  import { Project } from "@prisma/client";
  import { CreateProjectDto } from "./dto/CreateProject.dto";
  import { UpdateProjectDto } from "./dto/UpdateProject.dto";
  import { GetProjectsDto } from "./dto/GetProjects.dto";
  import { DeleteProjectDto } from "./dto/DeleteProjectdto";
  import { UserRoles, UserStatus } from "../user/user.types";
import { CreateTaskDto } from "../task/dto/CreateTask.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
  
  @ApiBearerAuth("JWT-auth")
  @ApiTags("Projects")
  @Controller("projects")
  @StatusRoles(UserStatus.ACTIVE)
  export class ProjectController {
    [x: string]: any;
    constructor(private readonly projectService: ProjectService) {}
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
    const creatorEmail = req.user?.email; // Lấy email từ token
    return this.projectService.createProject(createProjectDto, creatorEmail);
  }
    @Get(":id")
    getProjectById(@Param("id", ParseIntPipe) id: number) {
      return this.projectService.getProjectById(id);
    }
  
    @Get()
    getProjects(
      @Query("pageNumber") pageNumber: number = 1,
      @Query("pageSize") pageSize: number = 10,
      @Query("keyword") keyword?: string
    ) {
      return this.projectService.getProjects(pageNumber, pageSize, keyword);
    }
    @Roles(UserRoles.ADMIN, UserRoles.SEP) 
    @Put(":id")
    updateProject(
      @Param("id", ParseIntPipe) id: number,
      @Body() updateProjectDto: UpdateProjectDto
    ) {
      return this.projectService.updateProject(id, updateProjectDto);
    }
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @Delete(":id")
    deleteProject(@Param("id", ParseIntPipe) id: number) {
      return this.projectService.deleteProject(id);
    }
  }
  