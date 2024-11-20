import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ description: "email", default: "admin@lms.tech" })
  @IsEmail()
  email: string;
}
