"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwaggerConfig = getSwaggerConfig;
const swagger_1 = require("@nestjs/swagger");
function getSwaggerConfig() {
    return new swagger_1.DocumentBuilder()
        .setTitle('Harf Banaras E-Commerce API')
        .setDescription('Complete API documentation for Harf Banaras platform')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'access-token')
        .addTag('Auth', 'Authentication endpoints')
        .addTag('Products', 'Product management endpoints')
        .addTag('Cart', 'Shopping cart endpoints')
        .addTag('Orders', 'Order management endpoints')
        .addTag('Users', 'User management endpoints')
        .build();
}
//# sourceMappingURL=index.js.map