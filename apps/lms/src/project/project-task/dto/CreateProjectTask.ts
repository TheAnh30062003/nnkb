import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateProjectTaskDto {
  @ApiProperty({ description: 'ID of the associated project' })
  @IsInt()
  @IsPositive()  // Ensures the project ID is a positive integer
  readonly projectId: number;

  @ApiProperty({ description: 'ID of the associated task' })
  @IsInt()
  @IsPositive()  // Ensures the task ID is a positive integer
  readonly taskId: number;
}
