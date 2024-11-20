import {
  Controller,
  Post,
  Body,
  Req,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  Get,
  ParseFilePipeBuilder,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../decorator/customize";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { User } from "@prisma/client";
import { StatusRoles } from "../role/status.decorator";
import { UserStatus } from "../user/user.types";
import { LoginValidationPipe } from "./pipes/login-validation.pipe";
import { UserLoginDto } from "./dto/user-login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiBearerAuth("JWT-auth")
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  @UsePipes(LoginValidationPipe)
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post("logout")
  handleLogout(@Req() req) {
    return this.authService.logout(req.user);
  }

  @Get("profile")
  getProfile(
    @Req() request: Request
  ): Promise<Omit<User, "password" | "status">> {
    return this.authService.getUserProfile(request);
  }

  @Post("forgot-password")
  @Public()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Put("reset-password")
  @Public()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Put("change-password")
  @StatusRoles(UserStatus.ACTIVE, UserStatus.PENDING)
  changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.authService.changePassword(request, changePasswordDto);
  }

  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Update profile with optional file",
    type: UpdateProfileDto,
  })
  @Put("profile")
  @StatusRoles(UserStatus.ACTIVE)
  UpdateProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: ".(jpeg|jpg|png)",
        })
        .build({
          fileIsRequired: false,
        })
    )
    file: Express.Multer.File
  ) {
        const { firstName, lastName, dob } = updateProfileDto;
        if (!firstName && !lastName && !dob && !file) {
          throw new HttpException("At least one profile field or file must be provided.", HttpStatus.BAD_REQUEST);
        }
    return this.authService.updateProfile(
      req.user.email,
      updateProfileDto,
      file
    );
  }

  @Post("verify-reset-token")
  @Public()
  verifyResetToken(@Body("resetToken") resetToken: string) {
    return this.authService.verifyResetToken(resetToken);
  }
}
