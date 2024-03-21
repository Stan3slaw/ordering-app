import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';

import { KnexModule, LoggerModule, RmqModule } from '@app/common';

import { OrderModule } from 'apps/order/src/order.module';

import { OrderCollectorController } from './order-collector.controller';
import { OrderCollectorService } from './order-collector.service';
import { OrderApiModule } from './order-api/order-api.module';
import { NOTIFICATION_SERVICE } from './constants/services.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_ORDER_COLLECTOR_QUEUE: Joi.string().required(),
        BASE_URL: Joi.string().required(),
        IS_DEV_MODE: Joi.boolean(),
        IS_VERBOSE_MODE: Joi.boolean(),
      }),
      envFilePath: './apps/order-collector/.env',
    }),
    RmqModule.register({
      name: NOTIFICATION_SERVICE,
    }),
    OrderApiModule,
    OrderModule,
    KnexModule,
    LoggerModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [OrderCollectorController],
  providers: [OrderCollectorService],
})
export class OrderCollectorModule {}
