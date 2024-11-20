import { NestFactory } from "@nestjs/core";
import { StorageModule } from "./storage.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

const enableSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("Cubone Storage Swagger")
    .setDescription("Cubone Storage API")
    .setVersion("1.0").addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(StorageModule);
  app.enableShutdownHooks();
  enableSwagger(app);
  await app.listen(3000);
}
bootstrap();
