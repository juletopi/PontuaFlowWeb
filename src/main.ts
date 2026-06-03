import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
const expressLayouts = require('express-ejs-layouts');
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.use(expressLayouts);
  app.set('layout', 'layouts/layout');

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.locals.API_URL = process.env.API_URL || '';

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`PontuaFlowWeb running on http://localhost:${port}`);
}

bootstrap();
