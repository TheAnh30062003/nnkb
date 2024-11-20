import { Paging } from "../request.type";

export type FilterFileRequest = Paging & { search?: string };
