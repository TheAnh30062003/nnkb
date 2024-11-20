import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./passport/jwt.strategy";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    UserModule,
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
