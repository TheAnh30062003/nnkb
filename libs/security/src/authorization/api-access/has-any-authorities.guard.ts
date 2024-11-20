import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { AbilityFactoryService } from "@cubone/security/authorization/api-access/ability-factory.service";
import { ApiResource } from "@cubone/security/model/api-resource";
import { Reflector } from "@nestjs/core";
import { HAS_ANY_AUTHORITIES } from "@cubone/security/authorization/api-access/has-any-authorities.decorator";

@Injectable()
export class HasAnyAuthoritiesGuard implements CanActivate {
  private readonly logger = new Logger(HasAnyAuthoritiesGuard.name);

  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactoryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorities =
      this.reflector.get<string[]>(HAS_ANY_AUTHORITIES, context.getHandler()) ||
      [];
    this.logger.debug(`Resource authorities: ${authorities}`);
    const request = context.switchToHttp().getRequest();
    const ability = this.abilityFactory.createApiResourceAbilityForCtxUser(
      request.user,
    );

    return ability.can(
      "access",
      ApiResource.create(
        request.method,
        request.url,
        request.isPublic,
        authorities,
      ),
    );
  }
}
