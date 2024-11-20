import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";

export class GeneratePasswordDto {
  @ApiProperty({ name: "email", default: "user@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
