import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { NODE_APP_PORT, NODE_ENV, SWAGGER_PATH } from './config/common-configs';
import { AllExceptionsFilter } from './filters';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { customOptions, swaggerConfig } from './config/swagger.config';

async function initializeApp(app: INestApplication) {
  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'device'],
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
}

async function initializeSwagger(app: INestApplication) {
  // Swagger
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_PATH, app, swaggerDocument, customOptions);
}

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const appOptions = {
    cors: true,
    bufferLogs: true,
  };
  const app = await NestFactory.create(AppModule, appOptions);

  await initializeApp(app);

  if (NODE_ENV === 'development') {
    initializeSwagger(app);
  }

  await app.listen(NODE_APP_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
