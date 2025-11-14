import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { requestCaptureMiddleware } from './common/middleware/request-capture.middleware';
import { ResponseCaptureInterceptor } from './common/interceptors/response-capture.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se propriedades extras forem enviadas
      transform: true, // Transforma automaticamente os tipos
      transformOptions: {
        enableImplicitConversion: true, // Conversão automática de tipos
      },
    }),
  );

  // Habilitar CORS para React Native
  app.enableCors({
    origin: '*', // Ajustar em produção
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Galinheiro API')
    .setDescription('Documentação oficial do backend do app Galinheiro.')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Captura requisições JSON do front e salva em arquivos (captured/front)
  app.use(requestCaptureMiddleware);

  // Interceptor global para capturar respostas e salvar em arquivos (captured/back)
  app.useGlobalInterceptors(new ResponseCaptureInterceptor());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Aplicação rodando em: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📘 Swagger disponível em: http://localhost:${process.env.PORT ?? 3000}/docs`);
}
bootstrap();
