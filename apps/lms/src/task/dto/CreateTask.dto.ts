import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsEnum, IsNumber, IsInt, IsDateString } from "class-validator";
import { Status } from "@prisma/client";

export class CreateTaskDto {
  @ApiProperty({ description: "Task title", default: "New Task" })
  @IsNotEmpty()
  readonly title: string;

  @ApiPropertyOptional({ description: "Task description", default: "Task description here" })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ description: "Project ID", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  readonly projectId: number;

  @ApiProperty({ description: "Task status", enum: Status, default: Status.PENDING })
  @IsOptional()
  @IsEnum(Status)
  readonly status?: Status = Status.PENDING;

  @ApiPropertyOptional({ description: "Priority of the task", example: 1 })
  @IsOptional()
  @IsInt()
  readonly priority?: number = 1;

  @ApiPropertyOptional({ description: "Due date for the task in dd/MM/yyyy format" })
  @IsOptional()
  readonly dueDate?: string; // Để làm việc với định dạng dd/MM/yyyy
}
