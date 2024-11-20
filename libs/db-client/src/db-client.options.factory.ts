import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DbClientOptions } from "@cubone/db-client/db-client.options";

@Injectable()
export class DbClientOptionsFactory {
  constructor(private configService: ConfigService) {}

  createDbClientOptions(): DbClientOptions {
    return {
      url: this.configService.get("database.url"),
    };
  }
}
