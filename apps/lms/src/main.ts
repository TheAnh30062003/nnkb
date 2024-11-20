import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "./core/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("NNKB API")
    .setDescription("API document for NNKB system")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "JWT-auth"
    )
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      tagsSorter: "alpha",
      persistAuthorization: true,
    },
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Config cookies
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
