import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';

import { RmqService } from '@app/common';

import type { OrderResponseDto } from 'apps/order/src/dtos/order-response.dto';

@Controller()
export class NotificationController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly pubSub: PubSub,
  ) {}

  @EventPattern('new_orders_collected')
  async handleNewOrders(
    @Payload()
    payload: OrderResponseDto | OrderResponseDto[],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.pubSub.publish('onNewOrdersCollected', { newOrders: payload });
    this.rmqService.ack(context);
  }
}
