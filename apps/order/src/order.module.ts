import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { KnexModule, LoggerModule, RmqModule } from '@app/common';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { ORDER_COLLECTOR_SERVICE } from './constants/services.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        DB_CLIENT: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_PORT: Joi.number().required(),
      }),
      envFilePath: ['./apps/order/.env', '.env'],
    }),
    KnexModule,
    LoggerModule,
    RmqModule.register({
      name: ORDER_COLLECTOR_SERVICE,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderRepository],
})
export class OrderModule {}
