import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// **Swagger imports**
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Coerce query/body primitives (e.g. page=1 strings) and apply @Type() from DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // **Swagger setup**
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('Todo API — auth and tasks')
    .setVersion('1.0')
    // Matches Authorization: Bearer <token> from POST /auth/login
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Шлях доступу до Swagger: /api
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
