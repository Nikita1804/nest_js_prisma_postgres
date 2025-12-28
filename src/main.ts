import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtGlobalGuard } from './auth/guards/jwt-global.guard';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет лишние поля, не описанные в DTO
      forbidNonWhitelisted: true, // Бросает ошибку при наличии лишних полей
      transform: true, // Преобразует типы
    }),
  );

  // Глобальный JWT Guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtGlobalGuard(reflector));

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('API для работы с пользователями')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'JWT-auth', // Это имя должно совпадать с именем в @ApiBearerAuth()
    )
    .addTag('user')
    .addTag('auth')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger documentation: http://localhost:3000/api`);
}
bootstrap();
