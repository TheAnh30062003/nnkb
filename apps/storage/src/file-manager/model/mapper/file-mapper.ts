import { FileResponse } from "../dto/response/file.type";
import { File } from "@prisma/client";

export const toFileResponse = (file: File): FileResponse =>
  <FileResponse>{
    id: Number(file.id),
    fileName: file.fileName,
    provider: file.provider,
    location: file.location,
  };
