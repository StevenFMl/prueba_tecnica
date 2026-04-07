import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para que el frontend (Vite :5173) pueda conectarse
  app.enableCors();

  // Pipe global de validación: activa class-validator en todos los DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // Elimina propiedades que no estén en el DTO
    forbidNonWhitelisted: true, // Lanza error si envían propiedades extra
    transform: true,        // Transforma payloads al tipo del DTO automáticamente
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
