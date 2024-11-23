import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { Status } from '@prisma/client';

export class GetProjectTasksDto {
  @ApiPropertyOptional({ description: 'Search by keyword (e.g., project name or task name)', default: 'Project' })
  @IsOptional()
  readonly keyword?: string;

  @ApiPropertyOptional({ description: 'Filter by status', default: 'PENDING' })
  @IsOptional()
  @IsEnum(Status, { message: 'Valid status required' })
  readonly status?: Status;

  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  @IsOptional()
  @IsInt()
  readonly pageNumber?: number;

  @ApiPropertyOptional({ description: 'Number of items per page for pagination', default: 10 })
  @IsOptional()
  @IsInt()
  readonly pageSize?: number;

  @ApiPropertyOptional({ description: 'Sort order (asc or desc)', default: 'asc' })
  @IsOptional()
  readonly sortOrder?: string;

  @ApiPropertyOptional({ description: 'Field to sort by (e.g., projectId or taskId)', default: 'projectId' })
  @IsOptional()
  readonly sortBy?: string;
}
