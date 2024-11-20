import { Module } from "@nestjs/common";
import { SecurityModule } from "@cubone/security";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DbClientModule, DbClientOptionsFactory } from "@cubone/db-client";
import { FileController } from "./controller/file.controller";
import { FileService } from "./service/file.service";
import { FileRepository } from "./repository/file.repository";

@Module({
  controllers: [FileController],
  providers: [FileService, FileRepository],
  imports: [
    SecurityModule,
    DbClientModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DbClientOptionsFactory,
    }),
  ],
})
export class FileManagerModule {}
