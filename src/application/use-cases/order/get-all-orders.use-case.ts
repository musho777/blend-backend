import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { Order } from '@domain/entities/order.entity';

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
}
