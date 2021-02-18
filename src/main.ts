import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import admin, { initializeApp } from 'firebase-admin';

import { AppModule } from './app.module';
import { setEnvs } from '../env.config';
import { environment } from './environments/environment';
import { ValidationPipe } from '@nestjs/common';
import { BodyModifierInterceptor } from './core/interceptors/body-modifier.interceptor';

declare const module: any;

async function bootstrap() {
  const APP_NAME = 'Proxi';
  const DESCRIPTION = `${APP_NAME} API documentation`;
  const PREFIX = '/api/v1';
  const GLOBAL_TAG = APP_NAME.toLowerCase();
  const VERSION = '1.0';

  setEnvs();
  const firebaseApp = initializeApp({
    credential: admin.credential.cert({
      clientEmail: environment.firebaseClientEmail,
      privateKey: environment.firebasePrivateKey,
      projectId: environment.firebaseProjectId,
    }),
    databaseURL: environment.dbUrl,
  });
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new BodyModifierInterceptor());
  app.setGlobalPrefix(PREFIX);

  const options = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(DESCRIPTION)
    .setVersion(VERSION)
    .addTag(GLOBAL_TAG)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(PREFIX, app, document);

  await app.listen(process.env.PORT || 3001);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      firebaseApp.delete();
      app.close();
    });
  }
}
bootstrap();
