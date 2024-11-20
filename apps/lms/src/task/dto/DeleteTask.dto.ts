import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteTaskDto {
  @ApiProperty({ description: "ID of the task to delete", example: 1 })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
