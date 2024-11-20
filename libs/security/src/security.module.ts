import { Module } from "@nestjs/common";
import { AuthenticationModule } from "./authentication/authentication.module";
import { AuthorizationModule } from "@cubone/security/authorization/authorization.module";

@Module({
  providers: [],
  exports: [AuthenticationModule, AuthorizationModule],
  imports: [AuthenticationModule, AuthorizationModule],
})
export class SecurityModule {}
