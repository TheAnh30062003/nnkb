import { Module } from "@nestjs/common";
import { AbilityFactoryService } from "./api-access/ability-factory.service";
import { APP_GUARD } from "@nestjs/core";
import { HasAnyAuthoritiesGuard } from "@cubone/security/authorization/api-access/has-any-authorities.guard";

@Module({
  providers: [
    AbilityFactoryService,
    {
      provide: APP_GUARD,
      useClass: HasAnyAuthoritiesGuard,
    },
  ],
  exports: [AbilityFactoryService],
})
export class AuthorizationModule {}
