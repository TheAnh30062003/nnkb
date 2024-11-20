import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ name: "resetToken", required: true, type: "string" })
  @IsString()
  resetToken: string;

  @ApiProperty({ name: "newPassword", required: true, type: "string" })
  @IsString()
  @Length(8, 50, {
    message: "Password must be between 8 and 50 characters long",
  })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
    message: "Password must contain both letters and numbers",
  })
  newPassword: string;
}
