import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./storage.config";
import { FileManagerModule } from "./file-manager/file-manager.module";
import { S3ProviderModule } from "./s3-provider/s3-provider.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      expandVariables: true,
      load: [configuration],
    }),
    FileManagerModule,
    S3ProviderModule,
  ],
})
export class StorageModule {}
