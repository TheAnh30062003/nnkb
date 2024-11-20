import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { HasAnyAuthoritiesGuard } from "@cubone/security/authorization/api-access/has-any-authorities.guard";

export const HAS_ANY_AUTHORITIES = "has-any-authorities";

export function HasAnyAuthorities(...authorities: string[]) {
  return applyDecorators(
    SetMetadata(HAS_ANY_AUTHORITIES, authorities),
    UseGuards(HasAnyAuthoritiesGuard),
  );
}
