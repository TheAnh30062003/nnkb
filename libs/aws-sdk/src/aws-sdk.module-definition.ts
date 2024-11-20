import { ConfigurableModuleBuilder } from "@nestjs/common";
import { AwsSdkOptions } from "@cubone/aws-sdk/aws-sdk-options";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AwsSdkOptions>()
    .setFactoryMethodName("createAwsSdkOptions")
    .build();
