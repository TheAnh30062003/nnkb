import { ConfigurableModuleBuilder } from "@nestjs/common";
import { DbClientOptions } from "@cubone/db-client/db-client.options";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<DbClientOptions>()
    .setFactoryMethodName("createDbClientOptions")
    .build();
