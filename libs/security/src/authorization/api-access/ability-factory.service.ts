import { Injectable } from "@nestjs/common";
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
} from "@casl/ability";
import { CtxUser } from "@cubone/security/model/ctx-user";
import { ApiResource } from "@cubone/security/model/api-resource";

@Injectable()
export class AbilityFactoryService {
  createApiResourceAbilityForCtxUser(user: CtxUser) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    can("access", ApiResource, { isPublic: true });
    if (user.isAnonymous) {
      // do nothing, handled by authentication guard
    } else {
      can("access", ApiResource, { authorities: { $size: 0 } });
      can("access", ApiResource, {
        authorities: { $elemMatch: { $in: user.scopes ?? [] } },
      });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<ApiResource>,
    });
  }
}
