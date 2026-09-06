import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://harf-banaras-ui.vercel.app',
    'https://harf-banaras-gvl9ue2y4-nahak-deepak-prakashchandras-projects.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Harf Banaras API running on http://localhost:${port}/api/v1`);
}
bootstrap();
