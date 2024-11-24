import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { PrismaModule } from "./prisma/prisma.module";
import { StatusRolesGuard } from "./role/status.guard";
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { ProjectTaskModule } from "./project/project-task/project-task.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    ProjectModule,
    TaskModule,
    ProjectTaskModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: StatusRolesGuard,
    },
  ],
})
export class AppModule {}
