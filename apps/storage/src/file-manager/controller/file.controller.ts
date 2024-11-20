import { Controller, Get, Query } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { FileService } from "../service/file.service";
import { FileResponse } from "../model/dto/response/file.type";
import { PageResponse } from "../model/dto/response.type";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("File Manager")
@Controller("file")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  @ApiQuery({ name: "limit", required: false, type: "number" })
  @ApiQuery({ name: "offset", required: false, type: "number" })
  @ApiQuery({ name: "search", required: false, type: "string" })
  // @HasAnyAuthorities("file/read", "admin")
  async filterFiles(
    @Query("search") search?: string,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Promise<PageResponse<FileResponse>> {
    return lastValueFrom(
      this.fileService.filterFiles({
        limit: limit,
        offset: offset,
        search: search,
      }),
    );
  }
}
