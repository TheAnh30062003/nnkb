import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AwsSdkOptions } from "@cubone/aws-sdk/aws-sdk-options";

@Injectable()
export class AwsSdkOptionsFactory {
  constructor(private configService: ConfigService) {}

  createAwsSdkOptions(): AwsSdkOptions {
    return {
      region: this.configService.get("aws.region"),
      accessKeyId: this.configService.get("aws.accessKeyId"),
      secretAccessKey: this.configService.get("aws.secretAccessKey"),
      sessionToken: this.configService.get("aws.sessionToken"),
      s3: {
        bucket: this.configService.get("aws.s3.bucket"),
        presignedPutUrlDuration: this.configService.get(
          "aws.s3.presignedPutUrlDuration",
        ),
        presignedGetUrlDuration: this.configService.get(
          "aws.s3.presignedGetUrlDuration",
        ),
      },
      sqs: {},
      sns: {},
    };
  }
}
