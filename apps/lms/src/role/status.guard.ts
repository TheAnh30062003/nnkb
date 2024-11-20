import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserStatus } from "../user/user.types";
import { STATUS_ROLE_KEY } from "./status.decorator";

@Injectable()
export class StatusRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserStatus[]>(
      STATUS_ROLE_KEY,
      [context.getHandler(), context.getClass()]
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const notMatchRole = !roles?.includes(user?.status);
    if (roles && notMatchRole) return false;
    return true;
  }
}
