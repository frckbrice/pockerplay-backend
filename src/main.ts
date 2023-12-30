import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import dbconfig from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: console,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
  // console.log(dbconfig);
}

bootstrap();
