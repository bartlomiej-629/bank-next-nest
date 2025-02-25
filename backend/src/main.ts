import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (or specify specific origins)
  app.enableCors({
    origin: 'http://localhost:4000', // Allow your frontend to access the backend
    methods: ['GET', 'POST'], // Allow GET and POST methods
    credentials: true, // Optional: Allow cookies to be sent with the request
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
