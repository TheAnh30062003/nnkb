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
  import { TaskService } from "./task.service";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  import { Roles } from "../role/roles.decorator";
  import { StatusRoles } from "../role/status.decorator";
  import { UserRoles, UserStatus } from "../user/user.types";
  import { CreateTaskDto } from "./dto/CreateTask.dto";
  import { UpdateTaskDto } from "./dto/UpdateTask.dto";
  import { GetTaskDto } from "./dto/GetTask.dto";
  import { DeleteTaskDto } from "./dto/DeleteTask.dto";
  
  @ApiBearerAuth("JWT-auth")
  @ApiTags("Tasks")
  @Controller("tasks")
  @StatusRoles(UserStatus.ACTIVE)
  export class TaskController {
    constructor(private readonly taskService: TaskService) {}
  
    // Tạo mới Task
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto) {
      return this.taskService.createTask(createTaskDto);
    }
  
    // Lấy thông tin Task theo ID
    @Get(":id")
    getTaskById(@Param("id", ParseIntPipe) id: number) {
      return this.taskService.getTaskById(id);
    }
  
    // Lấy tất cả Task với phân trang và lọc
    @Get()
    getTasks(
      @Query("pageNumber") pageNumber: number = 1,
      @Query("pageSize") pageSize: number = 10,
      @Query("keyword") keyword?: string
    ) {
      return this.taskService.getTasks(pageNumber, pageSize, keyword);
    }
  
    // Cập nhật Task theo ID
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @Put(":id")
    updateTask(
      @Param("id", ParseIntPipe) id: number,
      @Body() updateTaskDto: UpdateTaskDto
    ) {
      return this.taskService.updateTask(id, updateTaskDto);
    }
  
    // Xóa Task (Logic delete)
    @Roles(UserRoles.ADMIN, UserRoles.SEP)
    @Delete(":id")
    deleteTask(@Param("id", ParseIntPipe) id: number) {
      return this.taskService.deleteTask(id);
    }
  }
  