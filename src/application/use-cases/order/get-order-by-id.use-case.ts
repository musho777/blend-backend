import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { Order } from '@domain/entities/order.entity';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
