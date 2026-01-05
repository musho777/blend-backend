import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { Order, OrderStatus } from '@domain/entities/order.entity';
import { IProductRepository, PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // If changing status to SUCCESS, reduce product stock
    if (status === OrderStatus.SUCCESS && order.status !== OrderStatus.SUCCESS) {
      await this.reduceProductStock(order);
    }

    await this.orderRepository.updateStatus(orderId, status);

    const updatedOrder = await this.orderRepository.findById(orderId);
    if (!updatedOrder) {
      throw new NotFoundException('Order not found after update');
    }

    return updatedOrder;
  }

  private async reduceProductStock(order: Order): Promise<void> {
    for (const item of order.items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      try {
        product.reduceStock(item.quantity);
        await this.productRepository.save(product);
      } catch (error) {
        throw new BadRequestException(
          `Failed to reduce stock for product ${product.title}: ${error.message}`
        );
      }
    }
  }
}
