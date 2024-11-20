import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthStrategy } from "@cubone/security/authentication/jwt-auth/jwt-auth.strategy";
import { JwtAuthGuard } from "@cubone/security/authentication/jwt-auth/jwt-auth.guard";

@Module({
  imports: [PassportModule, JwtModule.register({ global: true })],
  providers: [
    JwtAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthenticationModule {}
