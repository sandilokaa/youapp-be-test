import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  NestExpressApplication,
  ExpressAdapter,
} from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      logger: ['error', 'warn'],
      cors: true,
    },
  );
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enable('trust proxy');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(bodyParser.json());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = 3003;
  await app.listen(port);

  console.log(`server running on port ${port}`);
  return app;
}

void bootstrap();
