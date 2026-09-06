"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBootstrap = setupBootstrap;
const swagger_1 = require("@nestjs/swagger");
async function setupBootstrap(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Harf Banaras API')
        .setDescription('Harf Banaras E-Commerce Backend API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors();
    app.setGlobalPrefix('api/v1');
}
//# sourceMappingURL=bootstrap.js.map