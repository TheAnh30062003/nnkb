import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteProjectTaskDto {
  @ApiProperty({ description: 'ID of the ProjectTask to delete', default: 1 })
  @IsNotEmpty()
  readonly id: number;
}
