import { IsString, IsOptional, IsInt, Min, IsEnum } from "class-validator";
import { Exclude, Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRoles } from "../user.types";

export class GetUsersDto {
  @ApiPropertyOptional({ enum: UserRoles, description: "Filter by user role" })
  @Type(() => String)
  @IsEnum(UserRoles, { message: "Role must be one of NHANVIEN,SEP, or ADMIN" })
  @IsOptional()
  readonly role?: UserRoles;

  @ApiPropertyOptional({ description: "Page number", default: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  readonly pageNumber?: number = 1;

  @ApiPropertyOptional({ description: "Number of items per page", default: 10 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  readonly pageSize?: number = 10;

  @Exclude()
  password?: string;

  @ApiPropertyOptional({
    enum: ["asc", "desc"],
    description: "Sort by asc or desc",
    default: "desc",
  })
  @IsEnum(["asc", "desc"], {
    message: "sortOrder must be one of asc or desc",
  })
  @IsOptional()
  sortOrder?: "asc" | "desc" = "desc";

  @ApiPropertyOptional({
    enum: ["email", "firstName", "lastName"],
    description: "Sort by field",
    default: "email",
  })
  @IsEnum(["email", "firstName", "lastName"], {
    message: "sortBy must be one of email, firstName, or lastName",
  })
  @IsString()
  @IsOptional()
  sortBy?: string = "email";

  @ApiPropertyOptional({ description: "Search by keyword" })
  @IsString()
  @IsOptional()
  keyword?: string;
}
