import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import type { OrderResponseDto } from './dtos/order-response.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll(): Promise<OrderResponseDto[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) orderId: number,
  ): Promise<OrderResponseDto> {
    return this.orderService.findOne(orderId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.update(orderId, updateOrderDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) orderId: number): Promise<number> {
    return this.orderService.delete(orderId);
  }
}
