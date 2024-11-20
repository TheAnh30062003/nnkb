import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DeleteProjectDto {
  @ApiProperty({ description: "Project ID to delete", default: 1 })
  @IsNotEmpty()
  readonly id: number;
}
