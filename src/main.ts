import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`NestJS 서버가 http://localhost:${process.env.PORT ?? 3000} 에서 실행 중입니다.`);
}
bootstrap();
