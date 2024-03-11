import { Injectable } from '@nestjs/common';
import type { Knex } from 'knex';

import { KnexService } from '@app/common';

import type { OrderEntity } from './entities/order.entity';
import type { CreateOrder } from './interfaces/create-order.interface';
import type { UpdateOrder } from './interfaces/update-order.interface';

@Injectable()
export class OrderRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(
    createOrder: CreateOrder,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<OrderEntity> {
    const knex = trx ?? this.knexService.knex;

    const [createdOrder] = await knex('orders')
      .insert(createOrder)
      .returning('*');

    return createdOrder;
  }

  async findAll(
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<OrderEntity[]> {
    const knex: Knex = trx ?? this.knexService.knex;
    const foundOrders = await knex('orders').select<OrderEntity[]>();

    return foundOrders;
  }

  async findOne(
    orderId: number,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<OrderEntity> {
    const knex: Knex = trx ?? this.knexService.knex;
    const foundOrder = await knex('orders')
      .first<OrderEntity>()
      .where({ id: orderId });

    return foundOrder;
  }

  update = async (
    orderId: number,

    updateOrder: UpdateOrder,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<OrderEntity> => {
    const knex = trx ?? this.knexService.knex;
    const [updatedOrder] = await knex('orders')
      .update(updateOrder)
      .where({ id: orderId })
      .returning('*');

    return updatedOrder;
  };

  async delete(
    orderId: number,
    trx?: Knex.Transaction<unknown, unknown[]>,
  ): Promise<number> {
    const knex: Knex = trx ?? this.knexService.knex;
    const [deletedOrderId] = await knex('orders')
      .del()
      .where({ id: orderId })
      .returning('id');

    return deletedOrderId;
  }
}
