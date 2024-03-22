import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { RmqOptions } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { OauthModule } from './oauth.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(OauthModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('OAUTH'));
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
