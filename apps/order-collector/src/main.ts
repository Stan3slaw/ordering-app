import { NestFactory } from '@nestjs/core';

import { RmqService } from '@app/common';

import { OrderCollectorModule } from './order-collector.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(OrderCollectorModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('ORDER_COLLECTOR'));
  await app.startAllMicroservices();
}
bootstrap();
