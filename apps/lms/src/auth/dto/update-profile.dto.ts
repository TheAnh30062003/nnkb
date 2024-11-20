import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString, Matches, MaxDate, Validate, ValidateIf } from "class-validator";

export class UpdateProfileDto {
  @ApiProperty({ description: "First Name", default: "John" })
  @ValidateIf((o) => o.firstName !== undefined || o.lastName !== "")
  @IsNotEmpty()
  @IsString({ message: "Please Enter a Valid Name" })
  readonly firstName: string;

  @ApiProperty({ description: "Last Name", default: "Doe" })
  @IsNotEmpty()
  @IsString({ message: "Please Enter a Valid Name" })
  readonly lastName: string;

  @ApiProperty({
    description: "dob",
    default: "1990-01-01T00:00:00.000Z",
  })
  @IsNotEmpty()
  @ValidateIf(
    (value) => value.dob !== null && value.dob !== undefined && value.dob !== ""
  )
  @IsDateString({}, { message: "Invalid date format" })
  readonly dob: string;

  @ApiPropertyOptional({ type: "string", format: "binary" })
  @IsOptional()
  file: Express.Multer.File;
}
