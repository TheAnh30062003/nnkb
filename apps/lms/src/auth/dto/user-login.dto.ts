import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, ValidateIf } from "class-validator";
import { GrantType } from "../auth.types";

export class UserLoginDto {
  @ApiPropertyOptional({
    enum: GrantType,
    name: "grantType",
    default: GrantType.PASSWORD,
  })
  @IsEnum(GrantType)
  grantType: GrantType;

  @ApiPropertyOptional({ name: "email", default: "admin@lms.tech" })
  @ValidateIf((o) => o.grantType === GrantType.PASSWORD)
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ name: "password", default: "admin" })
  @ValidateIf((o) => o.grantType === GrantType.PASSWORD)
  @IsString({ message: "Please Enter a Valid Password" })
  password: string;

  @ApiPropertyOptional({ name: "refreshToken", default: "" })
  @ValidateIf((o) => o.grantType === GrantType.REFRESH_TOKEN)
  @IsString({ message: "Please Enter a Valid Refresh Token" })
  refreshToken: string;
}
