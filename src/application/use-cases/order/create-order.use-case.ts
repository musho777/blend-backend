import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { IProductRepository, PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import { Order } from '@domain/entities/order.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateOrderInput {
  productId: string;
  quantity: number;
  userId?: string;
  guestEmail?: string;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    const { productId, quantity, userId, guestEmail } = input;

    if (!userId && !guestEmail) {
      throw new BadRequestException('Either userId or guestEmail must be provided');
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const totalPrice = Order.calculateTotalPrice(product.price, quantity);

    const order = new Order(
      uuidv4(),
      productId,
      quantity,
      totalPrice,
      userId,
      guestEmail,
      new Date(),
    );

    return await this.orderRepository.create(order);
  }
}
