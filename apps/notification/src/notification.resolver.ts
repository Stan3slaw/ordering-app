import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { Order } from './dtos/order.dto';

@Resolver('Notification')
export class NotificationResolver {
  constructor(private readonly pubsub: PubSub) {}

  @Query(() => String)
  health(): string {
    return 'Okay!';
  }

  @Subscription(() => [Order], {
    name: 'newOrders',
  })
  onNewOrdersCollected(): AsyncIterator<Order[]> {
    return this.pubsub.asyncIterator('onNewOrdersCollected');
  }
}
