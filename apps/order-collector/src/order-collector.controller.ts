import { Controller } from '@nestjs/common';
import { EventPattern, Ctx, RmqContext } from '@nestjs/microservices';

import { RmqService } from '@app/common';

import { OrderCollectorService } from './order-collector.service';

@Controller()
export class OrderCollectorController {
  constructor(
    private readonly orderCollectorService: OrderCollectorService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('collect_orders')
  async handleCollectOrders(@Ctx() context: RmqContext): Promise<void> {
    this.orderCollectorService.collectOrders();
    this.rmqService.ack(context);
  }
}
