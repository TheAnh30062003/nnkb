import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum, IsNumber } from "class-validator";
import { Status } from "@prisma/client";

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: "Task title", default: "Updated Task" })
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional({ description: "Task description", default: "Updated description here" })
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ description: "Assigned user ID", example: 1 })
  @IsOptional()
  @IsNumber()
  readonly assignedToId?: number;

  @ApiPropertyOptional({ description: "Project ID", example: 1 })
  @IsOptional()
  @IsNumber()
  readonly projectId?: number;

  @ApiPropertyOptional({ description: "Task status", enum: Status, default: Status.PENDING })
  @IsOptional()
  @IsEnum(Status)
  readonly status?: Status;
}
