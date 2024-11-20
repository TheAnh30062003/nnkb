import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module"; // Adjust the path as necessary
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../role/roles.guard";
import { JwtService } from "@nestjs/jwt";
import { StatusRolesGuard } from "../role/status.guard";
@Module({
  imports: [PrismaModule], // Import PrismaModule here
  controllers: [UserController],
  providers: [
    UserService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
