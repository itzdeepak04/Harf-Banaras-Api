import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

export function getSwaggerConfig(): Omit<OpenAPIObject, 'paths'> {
  return new DocumentBuilder()
    .setTitle('Harf Banaras E-Commerce API')
    .setDescription('Complete API documentation for Harf Banaras platform')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Cart', 'Shopping cart endpoints')
    .addTag('Orders', 'Order management endpoints')
    .addTag('Users', 'User management endpoints')
    .build();
}
