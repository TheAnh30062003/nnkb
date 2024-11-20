import {
  BadRequestException,
  NotFoundException,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import ms from "ms";
import * as bcrypt from "bcrypt";
import * as generatePassword from "generate-password";
import { ConfigService } from "@nestjs/config";
import * as base64 from "base-64";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { GrantType } from "./auth.types";
import { UserStatus } from "../user/user.types";
import { User } from "@prisma/client";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import dayjs from "dayjs";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async validateUser(
    email: string,
    password: string,
    grantType: string,
    refreshToken: string
  ): Promise<any> {
    if (grantType === GrantType.PASSWORD) {
      return this.validateWithPassword(email, password);
    } else if (grantType === GrantType.REFRESH_TOKEN) {
      return this.validateWithRefreshToken(refreshToken);
    }
    return null;
  }

  async validateWithPassword(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (
      user &&
      (await this.userService.isValidPassword(password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateWithRefreshToken(refresh_token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      });
      const { email, refreshOtp } = payload;
      const user = await this.userService.findOneByEmail(email);

      const tokenRecord = await this.prisma.token.findUnique({
        where: { userId: user.id },
      });

      if (!tokenRecord || tokenRecord.refreshOtp !== refreshOtp || !user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async login(body: UserLoginDto) {
    const user = await this.validateUser(
      body?.email,
      body?.password,
      body.grantType,
      body?.refreshToken
    );
    if (!user) {
      throw new UnauthorizedException("Username/password không hợp lệ!");
    }
    if (user.isDeleted) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }
    // Check if user status is pending and if it's expired
    if (
      user.status === UserStatus.PENDING &&
      dayjs().isAfter(dayjs(user.expiredAt))
    ) {
      throw new ForbiddenException();
    }

    const refreshOtp = this.generateOtp();
    const payload = {
      email: user.email,
      role: user.role,
      id: user.id,
      refreshOtp,
      status: user.status,
    };

    const { email } = user;

    const refresh_token = this.createRefreshToken(payload);

    await this.userService.updateUserRefreshOtp(refreshOtp, user.id);

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      refresh_token,
      email,
    };
  }

  async getUserProfile(request): Promise<Omit<User, "password" | "status">> {
    const email = request.user.email;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const { password, status, ...returedUser } = user;
    return returedUser;
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE"),
    });
    return refresh_token;
  };

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ resetToken: string }> {
    const email = forgotPasswordDto.email;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException("Người dùng không tồn tại");
    }
    if (user.status === UserStatus.PENDING) {
      throw new ForbiddenException();
    }

    const token = await this.prisma.token.findUnique({
      where: {
        userId: user.id,
      },
    });

    const resetOtp = this.generateOtp();
    const expiresTime = ms(
      this.configService.get<string>("RESET_TOKEN_EXPIRE")
    );
    const expiresAt = Date.now() + expiresTime;

    if (token)
      await this.prisma.token.update({
        where: { id: token.id },
        data: { resetOtp },
      });

    const resetToken = this.createResetToken({
      email: user.email,
      id: user.id,
      resetOtp,
      expiresAt,
    });

    return { resetToken };
  }

  private createResetToken(payload: any): string {
    const jsonPayload = JSON.stringify(payload);
    const buffer = Buffer.from(jsonPayload);
    const resetToken = base64.encode(buffer);
    return resetToken;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { resetToken, newPassword } = resetPasswordDto;
      const result = await this.verifyResetToken(resetToken);
      const { userId } = result;

      // Check if the user exists
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException("User not found.");
      }
      if (user.status === UserStatus.PENDING) {
        throw new ForbiddenException();
      }
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        throw new BadRequestException();
      }
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the User table
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });

      // Update the reset token in the Token table
      await this.prisma.token.update({
        where: { userId: userId },
        data: {
          resetOtp: null,
        },
      });

      return { message: "Password reset successfully" };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new UnauthorizedException("Invalid or expired reset token");
    }
  }

  async updateProfile( 
    email: string,
    updateProfileDto: UpdateProfileDto,
    file: Express.Multer.File
  ) {
    try {
      if (updateProfileDto.dob && dayjs(updateProfileDto.dob).isAfter(dayjs())) {
        throw new HttpException(
          "Invalid date of birth",
          HttpStatus.BAD_REQUEST
        );
      }
      delete updateProfileDto.file;
      const user = await this.prisma.user.update({
        where: {
          email: email,
          isDeleted: false
        },
        data: updateProfileDto,
      });
      if (user) {
        return { message: "Profile updated successfully" };
      }
    } catch (error) {
      if(error instanceof HttpException){
        throw error;
      }
      throw new HttpException(
        "Failed to update profile",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  logout = async (user: any) => {
    try {
      await this.userService.updateUserRefreshOtp("", user.id);
      return { message: "Logout successfully" };
    } catch (error) {
      throw new Error("Failed to log out");
    }
  };

  async changePassword(
    request,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;
    const userId = request.user.id;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("Không tìm thấy người dùng.");
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Mật khẩu hiện tại không chính xác.");
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException();
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          status: user.status === "PENDING" ? "ACTIVE" : user.status,
        },
      });
    } catch (error) {
      throw new BadRequestException("Không thể cập nhật mật khẩu.");
    }
  }

  async verifyResetToken(resetToken: string) {
    try {
      const payload = this.decodeResetToken(resetToken);

      const { resetOtp, id, expiresAt } = payload;

      if (Date.now() > expiresAt) {
        throw new UnauthorizedException("Reset token đã hết hạn");
      }

      const tokenRecord = await this.prisma.token.findUnique({
        where: {
          userId: id,
        },
      });

      if (tokenRecord && tokenRecord.resetOtp === resetOtp) {
        return { message: "Valid Token", userId: tokenRecord.userId };
      } else {
        throw new UnauthorizedException("Reset token không hợp lệ");
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Reset token không hợp lệ");
    }
  }

  private generateOtp(): string {
    return generatePassword.generate({
      length: 6,
      numbers: true,
      symbols: false,
      uppercase: false,
      lowercase: false,
    });
  }

  private decodeResetToken(resetToken: string): any {
    try {
      const decoded = base64.decode(resetToken);
      return JSON.parse(decoded);
    } catch (error) {
      throw new UnauthorizedException("Reset token không hợp lệ");
    }
  }
}