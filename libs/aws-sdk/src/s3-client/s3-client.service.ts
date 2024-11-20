import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { AwsSdkOptions } from "@cubone/aws-sdk/aws-sdk-options";
import {
  HeadBucketCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Observable, from, of, map, catchError } from "rxjs";
import { MODULE_OPTIONS_TOKEN } from "@cubone/aws-sdk/aws-sdk.module-definition";

@Injectable()
export class S3ClientService implements OnModuleInit {
  private readonly logger = new Logger(S3ClientService.name);
  private readonly s3Client: S3Client;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: AwsSdkOptions) {
    this.s3Client = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
        sessionToken: options.sessionToken,
      },
    });
    this.logger.log("Initiated S3Client completed.");
  }

  async onModuleInit() {
    this.s3Client
      .send(new HeadBucketCommand({ Bucket: this.options.s3.bucket }))
      .then(() => {
        this.logger.log("Create S3 Client connection success");
      })
      .catch((error) => {
        this.logger.error(
          `S3 Client connection error: ${JSON.stringify(error)}`,
        );
        // enable fast fail by throw an exception
        // throw new Error("S3 Client connection error");
      });
  }

  getBucket(): string {
    return this.options.s3.bucket;
  }

  existObject(s3Key: string): Observable<boolean> {
    this.logger.debug(`existObject: ${this.options.s3.bucket}/${s3Key}`);
    return from(
      this.s3Client.send(
        new HeadObjectCommand({ Bucket: this.options.s3.bucket, Key: s3Key }),
      ),
    ).pipe(
      map((response) => {
        this.logger.log("Object existed: " + JSON.stringify(response));
        return true;
      }),
      catchError((err) => {
        this.logger.error("Error on existObject: " + JSON.stringify(err));
        return of(false);
      }),
    );
  }

  getPresignedPutUrl(s3Key: string): Observable<string> {
    // TODO: to implement
    return of("(Not implemented Yet) Presigned Put Url: " + s3Key);
  }

  getPresignedGetUrl(s3Key: string): Observable<string> {
    // TODO: to implement
    return of("(Not implemented Yet) Presigned Get Url: " + s3Key);
  }
}
