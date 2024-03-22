import { NestFactory } from '@nestjs/core';
import type { RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { RmqService } from '@app/common';

import { UserModule } from './user.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(UserModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('USER'));
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
