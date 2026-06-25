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

  const basePort = Number(process.env.PORT || 3000);
  let port = Number.isFinite(basePort) && basePort > 0 ? basePort : 3000;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      await app.listen(port);
      break;
    } catch (error: any) {
      if (error?.code !== 'EADDRINUSE' || attempt === 9) {
        throw error;
      }

      port += 1;
    }
  }

  console.log(`PontuaFlowWeb running on http://localhost:${port}`);
}

bootstrap();
