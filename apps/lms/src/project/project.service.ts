import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ConflictException,
    HttpException,
    HttpStatus,
  } from "@nestjs/common";
  import { PrismaService } from "../prisma/prisma.service";
  import { Prisma } from "@prisma/client";
  import { CreateProjectDto } from "./dto/CreateProject.dto";
  import { UpdateProjectDto } from "./dto/UpdateProject.dto";
  
  @Injectable()
  export class ProjectService {
    constructor(private prisma: PrismaService) {}
  
    // Tạo mới Project
    async createProject(data: CreateProjectDto): Promise<any> {
      try {
        const project = await this.prisma.project.create({
          data,
        });
        return project;
      } catch (error) {
        console.error("Error creating project:", error);
        throw new ConflictException("Could not create project");
      }
    }
  
    // Lấy thông tin Project theo ID
    async getProjectById(id: number): Promise<any> {
      try {
        const project = await this.prisma.project.findUnique({
          where: { id: id },
        });
  
        if (!project) {
          throw new NotFoundException(`Project with ID ${id} not found`);
        }
  
        return project;
      } catch (error) {
        console.error("Error retrieving project:", error);
        throw new HttpException("Error retrieving project", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Lấy tất cả các Project (có thể có phân trang và lọc theo keyword)
    async getProjects(
      pageNumber: number = 1,
      pageSize: number = 10,
      keyword?: string
    ): Promise<{
      projects: any[];
      totalCount: number;
      totalPages: number;
      pageNumber: number;
      pageSize: number;
    }> {
      const where: any = keyword
        ? {
            OR: [
              {
                name: {
                  contains: keyword,
                  mode: "insensitive", // Tìm kiếm không phân biệt hoa thường
                },
              },
              {
                description: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {};
  
      const totalCount = await this.prisma.project.count({ where });
      const totalPages = Math.ceil(totalCount / pageSize);
  
      const projects = await this.prisma.project.findMany({
        where,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });
  
      return {
        projects,
        totalCount,
        totalPages,
        pageNumber,
        pageSize,
      };
    }
  
    // Cập nhật Project theo ID
    async updateProject(id: number, data: UpdateProjectDto): Promise<any> {
      try {
        const updatedProject = await this.prisma.project.update({
          where: { id: id },
          data,
        });
        return updatedProject;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new NotFoundException(`Project with ID ${id} not found`);
          }
        }
        throw new BadRequestException("Could not update project");
      }
    }
  
    // Xóa Project theo ID (logic delete)
    async deleteProject(id: number): Promise<{ message: string }> {
      try {
        await this.prisma.project.update({
          where: { id },
          data: { isDeleted: true },
        });
        return { message: "Project deleted successfully" };
      } catch (error) {
        console.error("Error deleting project:", error);
        throw new HttpException(
          "Failed to delete project",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
  