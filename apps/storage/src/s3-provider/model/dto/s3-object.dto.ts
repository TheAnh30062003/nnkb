import { ApiResponseProperty } from "@nestjs/swagger";

export class S3ObjectDto {
  @ApiResponseProperty()
  bucket: string;
  @ApiResponseProperty()
  key: string;
  @ApiResponseProperty()
  location: string;

  constructor(key: string, bucket?: string, location?: string) {
    this.bucket = bucket;
    this.key = key;
    this.location = location;
  }
}
