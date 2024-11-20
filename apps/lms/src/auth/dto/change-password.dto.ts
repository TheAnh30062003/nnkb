import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, Matches, IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ description: "current password" })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ description: "new password" })
  @IsString()
  @MinLength(8, {
    message: "New password must be at least 8 characters long",
  })
  @Matches(/(?=.*\d)(?=.*[a-zA-Z])/i, {
    message: "New password must contain at least one letter and one number",
  })
  @IsNotEmpty()
  newPassword: string;
}
