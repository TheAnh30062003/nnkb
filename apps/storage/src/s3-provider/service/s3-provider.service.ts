import { Injectable } from "@nestjs/common";
import { S3ClientService } from "@cubone/aws-sdk/s3-client/s3-client.service";
import { S3ObjectDto } from "../model/dto/s3-object.dto";
import {
  defaultIfEmpty,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
} from "rxjs";

@Injectable()
export class S3ProviderService {
  constructor(private s3ClientService: S3ClientService) {}

  findByKey(key: string): Observable<S3ObjectDto> {
    return of(key).pipe(
      switchMap((s3Key) => this.s3ClientService.existObject(s3Key)),
      filter((existObject) => existObject === true),
      mergeMap(() => this.s3ClientService.getPresignedGetUrl(key)),
      map(
        (presignedGetUrl) =>
          new S3ObjectDto(
            key,
            this.s3ClientService.getBucket(),
            presignedGetUrl,
          ),
      ),
      defaultIfEmpty(new S3ObjectDto(key, this.s3ClientService.getBucket())),
    );
  }
}
