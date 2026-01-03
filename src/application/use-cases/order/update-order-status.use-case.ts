import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { Order, OrderStatus } from '@domain/entities/order.entity';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderRepository.updateStatus(orderId, status);

    const updatedOrder = await this.orderRepository.findById(orderId);
    if (!updatedOrder) {
      throw new NotFoundException('Order not found after update');
    }

    return updatedOrder;
  }
}
