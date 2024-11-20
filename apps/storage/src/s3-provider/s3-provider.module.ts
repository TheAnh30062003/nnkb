import { Module } from "@nestjs/common";
import { S3ProviderService } from "./service/s3-provider.service";
import { S3ObjectController } from "./controller/s3-object.controller";
import { SecurityModule } from "@cubone/security";
import { AwsSdkModule } from "@cubone/aws-sdk";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AwsSdkOptionsFactory } from "@cubone/aws-sdk/aws-sdk-options.factory";

@Module({
  controllers: [S3ObjectController],
  providers: [S3ProviderService],
  imports: [
    SecurityModule,
    AwsSdkModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: AwsSdkOptionsFactory,
    }),
  ],
})
export class S3ProviderModule {}
