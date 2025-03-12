import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('TicTacToe API Document')
  .setDescription('The API documentation for the TicTacToe game services')
  .setVersion('1.0')
  .addTag('API Docs')
  .build();

export const customOptions: SwaggerCustomOptions = {
  customSiteTitle: 'icTacToe API Document',
  swaggerOptions: {
    persistAuthorization: true,
    operationsSorter: 'method',
  },
};
