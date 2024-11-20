import { Injectable } from "@nestjs/common";
import { PrismaClientService } from "@cubone/db-client";
import { File, Prisma } from "@prisma/client";
import { FilterFileRequest } from "../model/dto/request/filter-file-request.type";

@Injectable()
export class FileRepository {
  constructor(private prismaClientService: PrismaClientService) {}

  async createFile(fileEntity: Prisma.FileCreateInput): Promise<File | null> {
    return this.prismaClientService.file.create({ data: fileEntity });
  }

  async countFiles(request: FilterFileRequest): Promise<number> {
    return this.prismaClientService.file.count({
      where: {
        fileName: { contains: request.search },
      },
    });
  }

  async filterFiles(request: FilterFileRequest): Promise<File[]> {
    return this.prismaClientService.file.findMany({
      skip: request.offset,
      take: request.limit,
      where: {
        fileName: { contains: request.search },
      },
    });
  }
}
