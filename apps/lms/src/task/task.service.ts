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
  import { CreateTaskDto } from "./dto/CreateTask.dto";
  import { UpdateTaskDto } from "./dto/UpdateTask.dto";
  import { parse, isValid, formatISO } from 'date-fns';
  @Injectable()
  export class TaskService {
    [x: string]: any;
    constructor(private prisma: PrismaService) {}
  
    async createTask(data: CreateTaskDto, creatorEmail: string): Promise<any> {
      try {
        let dueDateISO = null;
    
        if (data.dueDate) {
          const dueDateParsed = parse(data.dueDate, "dd/MM/yyyy", new Date());
          if (!isValid(dueDateParsed)) {
            throw new ConflictException("Invalid due date format. Please use dd/MM/yyyy.");
          }
          const dueDateUTC = new Date(dueDateParsed);
          dueDateISO = formatISO(dueDateUTC);
        }
    
        const taskData = {
          title: data.title,
          description: data.description,
          dueDate: dueDateISO,
          project: { connect: { id: data.projectId } },
          status: data.status,
          priority: data.priority,
          createdBy: creatorEmail, // Lưu email người tạo
        };
    
        const task = await this.prisma.task.create({ data: taskData });
        return task;
      } catch (error) {
        console.error("Error creating task:", error);
        throw new ConflictException("Could not create task");
      }
    }

    
    
    // Lấy thông tin Task theo ID
    async getTaskById(id: number): Promise<any> {
      try {
        const task = await this.prisma.task.findUnique({
          where: { id },
          include: { assignedTo: true, project: true },
        });
  
        if (!task) {
          throw new NotFoundException(`Task with ID ${id} not found`);
        }
  
        return task;
      } catch (error) {
        console.error("Error retrieving task:", error);
        throw new HttpException("Error retrieving task", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  
    // Lấy tất cả các Task (có phân trang và lọc theo keyword)
    async getTasks(
      pageNumber: number = 1,
      pageSize: number = 10,
      keyword?: string
    ): Promise<{
      tasks: any[];
      totalCount: number;
      totalPages: number;
      pageNumber: number;
      pageSize: number;
    }> {
      const where: any = keyword
        ? {
            OR: [
              {
                title: {
                  contains: keyword,
                  mode: "insensitive",
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
  
      const totalCount = await this.prisma.task.count({ where });
      const totalPages = Math.ceil(totalCount / pageSize);
  
      const tasks = await this.prisma.task.findMany({
        where,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        include: { assignedTo: true, project: true },
      });
  
      return {
        tasks,
        totalCount,
        totalPages,
        pageNumber,
        pageSize,
      };
    }
  
    // Cập nhật Task theo ID
    async updateTask(id: number, data: UpdateTaskDto): Promise<any> {
      try {
        const updatedTask = await this.prisma.task.update({
          where: { id },
          data,
        });
        return updatedTask;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new NotFoundException(`Task with ID ${id} not found`);
          }
        }
        throw new BadRequestException("Could not update task");
      }
    }
  
    // Xóa Task theo ID (logic delete)
    async deleteTask(id: number): Promise<{ message: string }> {
      try {
        await this.prisma.task.update({
          where: { id },
          data: { isDeleted: true },
        });
        return { message: "Task deleted successfully" };
      } catch (error) {
        console.error("Error deleting task:", error);
        throw new HttpException(
          "Failed to delete task",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
  