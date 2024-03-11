import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';

import { OrderRepository } from './order.repository';
import type { CreateOrderDto } from './dtos/create-order.dto';
import type { OrderResponseDto } from './dtos/order-response.dto';
import type { CreateOrder } from './interfaces/create-order.interface';
import type { OrderEntity } from './entities/order.entity';
import type { UpdateOrderDto } from './dtos/update-order.dto';
import type { UpdateOrder } from './interfaces/update-order.interface';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  private static mapOrderEntityToOrderResponseDto(
    orderEntity: OrderEntity,
  ): OrderResponseDto {
    return {
      id: orderEntity.id,
      name: orderEntity.name,
      totalPrice: orderEntity.total_price,
      details: orderEntity.details,
      createdAt: orderEntity.created_at,
      updatedAt: orderEntity.updated_at,
    };
  }

  private static mapCreateOrderDtoToOrderEntity(
    createOrderDto: CreateOrderDto,
  ): CreateOrder {
    return {
      name: createOrderDto.name,
      total_price: createOrderDto.totalPrice,
      details: createOrderDto.details,
    };
  }

  private static mapUpdateOrderDtoToOrderEntity(
    updateOrderDto: UpdateOrderDto,
  ): UpdateOrder {
    const updateOrder: UpdateOrder = {};

    if (!isNil(updateOrderDto.name)) {
      updateOrder.name = updateOrderDto.name;
    }

    if (!isNil(updateOrderDto.totalPrice)) {
      updateOrder.total_price = updateOrderDto.totalPrice;
    }

    if (!isNil(updateOrderDto.details)) {
      updateOrder.details = updateOrderDto.details;
    }

    return updateOrder;
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const createdOrder = await this.orderRepository.create(
      OrderService.mapCreateOrderDtoToOrderEntity(createOrderDto),
    );

    return OrderService.mapOrderEntityToOrderResponseDto(createdOrder);
  }

  async findAll(): Promise<OrderResponseDto[]> {
    const foundOrders = await this.orderRepository.findAll();

    const mappedOrders = foundOrders.map((order) =>
      OrderService.mapOrderEntityToOrderResponseDto(order),
    );

    return mappedOrders;
  }

  async findOne(orderId: number): Promise<OrderResponseDto> {
    const foundOrder = await this.orderRepository.findOne(orderId);

    if (!foundOrder) {
      throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
    }

    return OrderService.mapOrderEntityToOrderResponseDto(foundOrder);
  }

  update = async (
    orderId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> => {
    const foundOrder = await this.orderRepository.findOne(orderId);

    if (!foundOrder) {
      throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
    }

    const updatedOrder = await this.orderRepository.update(
      orderId,
      OrderService.mapUpdateOrderDtoToOrderEntity(updateOrderDto),
    );

    return OrderService.mapOrderEntityToOrderResponseDto(updatedOrder);
  };

  async delete(bookId: number): Promise<number> {
    await this.findOne(bookId);
    const deletedOrderId = await this.orderRepository.delete(bookId);

    return deletedOrderId;
  }
}
