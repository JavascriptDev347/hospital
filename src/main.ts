import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {GlobalResponseInterceptor} from "./common/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // global pipe qo'shish
  app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // faqat DTO dagi maydonlarni qabul qiladi
        forbidNonWhitelisted: true, // DTO da bo‘lmagan maydonlarni rad etadi
        transform: true, // kiruvchi ma’lumotlarni DTO tipiga o‘zgartiradi
    }));

  // global intepceptor qo'shish
    app.useGlobalInterceptors(new GlobalResponseInterceptor());

    // 🔹 Barcha endpointlar oldiga 'api/v1' prefix qo‘shadi
    app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
