import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsNumber } from "class-validator";

export class GetTaskDto {
  @ApiPropertyOptional({ description: "Page number for pagination", default: 1 })
  @IsOptional()
  @IsNumber()
  readonly pageNumber?: number;

  @ApiPropertyOptional({ description: "Page size for pagination", default: 10 })
  @IsOptional()
  @IsNumber()
  readonly pageSize?: number;

  @ApiPropertyOptional({ description: "Keyword to search for in task title or description", default: "" })
  @IsOptional()
  @IsString()
  readonly keyword?: string;
}
