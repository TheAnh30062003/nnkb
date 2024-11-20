import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { Status } from "@prisma/client";

export class GetProjectsDto {
  @ApiPropertyOptional({ description: "Search by keyword", default: "Project" })
  @IsOptional()
  readonly keyword?: string;

  @ApiPropertyOptional({ description: "Filter by status", default: "PENDING" })
  @IsOptional()
  @IsEnum(Status, { message: "Valid status required" })
  readonly status?: Status;

  @ApiPropertyOptional({ description: "Page number", default: 1 })
  @IsOptional()
  readonly pageNumber?: number;

  @ApiPropertyOptional({ description: "Page size", default: 10 })
  @IsOptional()
  readonly pageSize?: number;

  @ApiPropertyOptional({ description: "Sort order", default: "asc" })
  @IsOptional()
  readonly sortOrder?: string;

  @ApiPropertyOptional({ description: "Sort by field", default: "name" })
  @IsOptional()
  readonly sortBy?: string;
}
