import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsEnum } from "class-validator";
import { UserRoles } from "../user.types";

export class CreateUserDto {
  @ApiProperty({ description: "New user email", default: "newuser@gmail.com" })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: "Role", default: "NHANVIEN" })
  @IsEnum(["NHANVIEN", "SEP", "ADMIN"], {
    message: "Valid role required",
  })
  readonly role: UserRoles;
}
