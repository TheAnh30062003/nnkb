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
  
  @ApiBearerAuth("JWT-auth")
  @ApiTags("Projects")
  @Controller("projects")
  @StatusRoles(UserStatus.ACTIVE)
  export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @Post()
    createProject(@Body() createProjectDto: CreateProjectDto) {
      return this.projectService.createProject(createProjectDto);
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
  