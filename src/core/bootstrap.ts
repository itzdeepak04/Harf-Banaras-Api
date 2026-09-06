import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupBootstrap(app: INestApplication): Promise<void> {
  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Harf Banaras API')
    .setDescription('Harf Banaras E-Commerce Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api/v1');
}
