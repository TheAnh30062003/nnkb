import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateProjectTaskDto {
  @ApiPropertyOptional({ description: 'ID of the associated project', default: 1 })
  @IsOptional()
  @IsInt()
  readonly projectId?: number;

  @ApiPropertyOptional({ description: 'ID of the associated task', default: 1 })
  @IsOptional()
  @IsInt()
  readonly taskId?: number;
}
