import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, IsDateString, IsOptional } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ description: "First Name" })
  @IsOptional()
  @IsString({ message: "Please Enter a Valid Name" })
  readonly firstName: string;

  @ApiPropertyOptional({ description: "Last Name" })
  @IsOptional()
  @IsString({ message: "Please Enter a Valid Name" })
  readonly lastName: string;

  @ApiPropertyOptional({ description: "Email" })
  @IsOptional()
  @IsEmail({}, { message: "Please Enter a Valid Email" })
  readonly email: string;

  @ApiPropertyOptional({ description: "Date of Birth" })
  @IsOptional()
  @IsDateString()
  readonly dob: string;
}
