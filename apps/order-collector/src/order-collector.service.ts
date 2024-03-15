import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import type { CreateOrder } from 'apps/order/src/interfaces/create-order.interface';
import { OrderRepository } from 'apps/order/src/order.repository';
import type { OrderEntity } from 'apps/order/src/entities/order.entity';
import type { OrderResponseDto } from 'apps/order/src/dtos/order-response.dto';
import { Logger } from '@app/common';

import { OrderApiService } from './order-api/order-api.service';
import type { OrderedProductEntity } from './order-api/entities/ordered-product.entity';
import { NOTIFICATION_SERVICE } from './constants/services.constants';

@Injectable()
export class OrderCollectorService {
  constructor(
    private readonly logger: Logger,
    private readonly orderApiService: OrderApiService,
    private readonly orderRepository: OrderRepository,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {
    this.logger.setContext(OrderCollectorService.name);
  }

  private limit = 2;
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

  private static mapOrderEntityToOrderResponseDto(
    orderEntity: OrderEntity,
  ): OrderResponseDto {
    return {
      id: orderEntity.id,
      orderId: orderEntity.order_id,
      name: orderEntity.name,
      totalPrice: orderEntity.total_price,
      details: orderEntity.details,
      createdAt: orderEntity.created_at,
      updatedAt: orderEntity.updated_at,
    };
  }

  async collectOrders(): Promise<void> {
    const { products: newOrders } =
      await this.orderApiService.getOrderedProducts(this.limit, this.skip);

    this.skip += 2;

    const mappedOrdersToEntities = newOrders.map((order) =>
      OrderCollectorService.mapOrderedProductEntityToOrderEntity(order),
    );

    const insertedOrders = await this.orderRepository.insert(
      mappedOrdersToEntities,
    );

    if (!isEmpty(insertedOrders)) {
      const mappedOrdersToResponse = insertedOrders.map((order) =>
        OrderCollectorService.mapOrderEntityToOrderResponseDto(order),
      );

      this.notificationClient.emit('new_orders_collected', {
        payload: mappedOrdersToResponse,
      });
    }
  }
}
