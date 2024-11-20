import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { Status } from "@prisma/client";

export class UpdateProjectDto {
  @ApiPropertyOptional({ description: "Project name", default: "Updated Project" })
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: "Project description", default: "Updated project description" })
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ description: "Project status", default: "PENDING" })
  @IsOptional()
  @IsEnum(Status, { message: "Valid status required" })
  readonly status?: Status;
}
