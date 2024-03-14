import { Injectable } from '@nestjs/common';

import type { OrderedProductEntity } from './entities/ordered-product.entity';
import { OrderApiProxyService } from './order-api-proxy.service';

@Injectable()
export class OrderApiService {
  constructor(private readonly proxy: OrderApiProxyService) {}

  getOrderedProducts(
    limit?: number,
    skip?: number,
  ): Promise<{ products: OrderedProductEntity[] }> {
    return this.proxy.request({
      url: `/products`,
      method: 'GET',
      params: {
        limit: limit ?? 0,
        skip: skip ?? 0,
      },
    });
  }

  getOrderedProduct(orderId: number): Promise<OrderedProductEntity> {
    return this.proxy.request({
      url: `/products/${orderId}`,
      method: 'GET',
    });
  }
}
