import { Module } from "@nestjs/common";
import { S3ClientService } from "@cubone/aws-sdk/s3-client/s3-client.service";
import { ConfigurableModuleClass } from "@cubone/aws-sdk/aws-sdk.module-definition";

@Module({
  providers: [S3ClientService],
  exports: [S3ClientService],
  imports: [],
})
export class AwsSdkModule extends ConfigurableModuleClass {}
