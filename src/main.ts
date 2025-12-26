import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

// import { ConfigService } from '@nestjs/config';
// import { Logger } from '@nestjs/common';
// import * as process from 'node:process';
// import { getCorsConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  config();
  //
  // const config = app.get(ConfigService);
  // const logger = new Logger(AppModule.name);
  //
  // app.enableCors(getCorsConfig(config));
  //
  // const port = config.getOrThrow<number>('HTTP_PORT');
  // const host = config.getOrThrow<string>('HTTP_HOST');
  //
  // try {
  //   await app.listen(port);
  //   logger.log(`Listening on ${host}`);
  // } catch (e) {
  //   logger.error('Failed to listen:', e);
  //   process.exit(1);
  // }
  await app.listen(3000);
}
bootstrap();
