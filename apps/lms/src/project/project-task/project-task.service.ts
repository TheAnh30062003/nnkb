import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UpdateProjectTaskDto } from "./dto/UpdateProjectTask";
import { CreateProjectTaskDto } from "./dto/CreateProjectTask";

@Injectable()
export class ProjectTaskService {
  constructor(private prisma: PrismaService) {}

  // Tạo mới ProjectTask (liên kết Project và Task)
  async createProjectTask(data: CreateProjectTaskDto, creatorEmail: string): Promise<any> {
    try {
      const projectTask = await this.prisma.projectTask.create({
        data: {
          projectId: data.projectId,
          taskId: data.taskId,

        },
      });

      return projectTask;
    } catch (error) {
      console.error("Error creating project-task:", error);
      throw new ConflictException("Could not create project-task");
    }
  }

  // Lấy thông tin ProjectTask theo ID
  async getProjectTaskById(id: number): Promise<any> {
    try {
      const projectTask = await this.prisma.projectTask.findUnique({
        where: { id: id },
      });

      if (!projectTask) {
        throw new NotFoundException(`ProjectTask with ID ${id} not found`);
      }

      return projectTask;
    } catch (error) {
      console.error("Error retrieving project-task:", error);
      throw new HttpException("Error retrieving project-task", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy tất cả các ProjectTask (có thể có phân trang và lọc theo keyword)
  async getProjectTasks(
    pageNumber: number = 1,
    pageSize: number = 10,
    keyword?: string
  ): Promise<{
    projectTasks: any[];
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  }> {
    const where: any = keyword
      ? {
          OR: [
            {
              project: {
                name: {
                  contains: keyword,
                  mode: "insensitive", // Tìm kiếm không phân biệt hoa thường
                },
              },
            },
            {
              task: {
                name: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : {};

    const totalCount = await this.prisma.projectTask.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);

    const projectTasks = await this.prisma.projectTask.findMany({
      where,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return {
      projectTasks,
      totalCount,
      totalPages,
      pageNumber,
      pageSize,
    };
  }

  // Cập nhật ProjectTask theo ID
  async updateProjectTask(id: number, data: UpdateProjectTaskDto): Promise<any> {
    try {
      const updatedProjectTask = await this.prisma.projectTask.update({
        where: { id: id },
        data,
      });
      return updatedProjectTask;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(`ProjectTask with ID ${id} not found`);
        }
      }
      throw new BadRequestException("Could not update project-task");
    }
  }

  // Xóa ProjectTask (logic delete)
  async deleteProjectTask(id: number): Promise<{ message: string }> {
    try {
      await this.prisma.projectTask.update({
        where: { id },
        data: { isDeleted: true },
      });
      return { message: "ProjectTask deleted successfully" };
    } catch (error) {
      console.error("Error deleting project-task:", error);
      throw new HttpException(
        "Failed to delete project-task",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
