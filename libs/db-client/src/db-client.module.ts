import { Module } from "@nestjs/common";
import { ConfigurableModuleClass } from "@cubone/db-client/db-client.module-definition";
import { PrismaClientService } from "@cubone/db-client/prisma/prisma-client.service";

@Module({
  imports: [],
  providers: [PrismaClientService],
  exports: [PrismaClientService],
})
export class DbClientModule extends ConfigurableModuleClass {}
