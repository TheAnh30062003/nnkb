export interface AwsSdkOptions {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  s3?: {
    bucket: string;
    presignedGetUrlDuration?: number;
    presignedPutUrlDuration?: number;
  };
  sns?: {};
  sqs?: {};
}
