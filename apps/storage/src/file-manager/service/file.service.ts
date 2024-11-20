import { Injectable } from "@nestjs/common";
import {
  defaultIfEmpty,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  of,
  zip,
} from "rxjs";
import { FileRepository } from "../repository/file.repository";
import { FilterFileRequest } from "../model/dto/request/filter-file-request.type";
import { PageResponse } from "../model/dto/response.type";
import { FileResponse } from "../model/dto/response/file.type";
import { toFileResponse } from "../model/mapper/file-mapper";

@Injectable()
export class FileService {
  constructor(private fileRepository: FileRepository) {}

  filterFiles(
    filterFileRequest: FilterFileRequest,
  ): Observable<PageResponse<FileResponse>> {
    return of(filterFileRequest).pipe(
      filter((request) => !!request.search),
      mergeMap((request) =>
        zip(
          from(this.fileRepository.countFiles(request)),
          from(this.fileRepository.filterFiles(request)),
        ).pipe(
          map(
            ([total, data]) =>
              <PageResponse<FileResponse>>{
                total: total,
                data: data?.map((file) => toFileResponse(file)) ?? [],
              },
          ),
        ),
      ),
      defaultIfEmpty({ total: 0, data: [] }),
    );
  }
}
