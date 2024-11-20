import { SetMetadata } from "@nestjs/common";
import { UserStatus } from "../user/user.types";

export const STATUS_ROLE_KEY = "status-role";
export const StatusRoles = (...statusRoles: UserStatus[]) =>
  SetMetadata(STATUS_ROLE_KEY, statusRoles);
