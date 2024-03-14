import { Injectable } from '@nestjs/common';

import type { CreateOrder } from 'apps/order/src/interfaces/create-order.interface';
import { OrderRepository } from 'apps/order/src/order.repository';
import { Logger } from '@app/common';

import { OrderApiService } from './order-api/order-api.service';
import type { OrderedProductEntity } from './order-api/entities/ordered-product.entity';

@Injectable()
export class OrderCollectorService {
  constructor(
    private readonly logger: Logger,
    private readonly orderApiService: OrderApiService,
    private readonly orderRepository: OrderRepository,
  ) {
    this.logger.setContext(OrderCollectorService.name);
  }

  private limit = 10;
  private skip = 0;

  private static mapOrderedProductEntityToOrderEntity(
    orderedProductEntity: OrderedProductEntity,
  ): CreateOrder {
    return {
      order_id: orderedProductEntity.id,
      name: orderedProductEntity.title,
      total_price: orderedProductEntity.price,
      details: orderedProductEntity.description,
    };
  }

  async collectOrders(): Promise<void> {
    const { products: newOrders } =
      await this.orderApiService.getOrderedProducts(this.limit, this.skip);

    this.skip += 10;

    const mappedOrders = newOrders.map((order) =>
      OrderCollectorService.mapOrderedProductEntityToOrderEntity(order),
    );

    const insertedOrders = await this.orderRepository.insert(mappedOrders);

    this.logger.debug({ insertedOrders });
  }
}
