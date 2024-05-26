import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipes/validation.pipies';

async function start() {
  const PORT = process.env.PORT || 5005;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(
      'Бэкенд приложение с авторизацией и аунтефиукацией пользователей, для создания и чтения статей',
    )
    .setDescription('Документация для API')
    .addTag('Nadezhda')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
start();
