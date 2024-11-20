import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Logger, ValidationPipe } from "@nestjs/common";
import { passportJwtSecret } from "jwks-rsa";
import { ConfigService } from "@nestjs/config";
import { CtxUser } from "@cubone/security/model/ctx-user";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtAuthStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        jwksUri: configService.get("security.authentication.jwksUri"),
      }),
    });
  }

  private async validate(payload: any, done: any) {
    this.logger.debug(`Jwt payload: ${JSON.stringify(payload)}`);
    return CtxUser.authenticatedUser(
      payload.sub,
      payload.scope?.split(" ") ?? [],
    );
  }
}
