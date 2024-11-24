import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { Status } from "@prisma/client";

export class CreateProjectDto {
  [x: string]: string;
  @ApiProperty({ description: "Project name", default: "New Project" })
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ description: "Project description", default: "Project description here" })
  @IsOptional()
  readonly description?: string;


}
