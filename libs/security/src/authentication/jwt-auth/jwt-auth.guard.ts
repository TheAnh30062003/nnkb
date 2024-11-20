import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "@cubone/security/authentication/decorators/public.decorator";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { CtxUser } from "@cubone/security/model/ctx-user";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.logger.debug(
      `Request access endpoint: ${request.method} ${request.url}`,
    );
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      this.logger.debug(
        `Access public endpoint: ${request.method} ${request.url}`,
      );
      request["user"] = CtxUser.anonymousUser();
      request["isPublic"] = true;
      return true;
    }

    return super.canActivate(context);
  }
}
