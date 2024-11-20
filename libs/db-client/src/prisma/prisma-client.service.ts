import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DbClientOptions } from "@cubone/db-client/db-client.options";
import { PrismaClient } from "@prisma/client";
import { MODULE_OPTIONS_TOKEN } from "@cubone/db-client/db-client.module-definition";

@Injectable()
export class PrismaClientService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaClientService.name);

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private options: DbClientOptions) {
    super({
      datasourceUrl: options.url,
      log: [
        {
          emit: "event",
          level: "query",
        },
        {
          emit: "event",
          level: "error",
        },
      ],
    });
    this.logger.log("Initiated PrismaClient completed.");
  }

  async onModuleInit() {
    await this.$connect()
      .then(() => {
        this.logger.log("Create Prisma connection success");
        this.eventLogging();
      })
      .catch((error) => {
        this.logger.error(`Prisma connection error: ${JSON.stringify(error)}`);
        throw new Error("Prisma connection error");
      });
  }

  private eventLogging(): void {
    // @ts-ignore
    this.$on("query", (event) => {
      this.logger.debug(
        // @ts-ignore
        `QUERY DEBUG: ${JSON.stringify({ query: event.query, params: event.params })}`,
      );
    });
    // @ts-ignore
    this.$on("error", (event) => {
      this.logger.error(
        // @ts-ignore
        `QUERY ERROR: ${JSON.stringify(event)}`,
      );
    });
  }
}
