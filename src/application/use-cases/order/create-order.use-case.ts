import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { IProductRepository, PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import { Order, OrderStatus, PaymentMethod, OrderItem } from '@domain/entities/order.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerSurname: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  items: CreateOrderItemInput[];
  paymentMethod: string;
  userId?: string;
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
    const { customerName, customerSurname, customerAddress, customerPhone, customerEmail, items, paymentMethod, userId } = input;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${product.title}`);
      }

      orderItems.push(
        new OrderItem(
          uuidv4(),
          0,
          item.productId,
          item.quantity,
          item.price,
          item.name,
        ),
      );
    }

    const totalPrice = Order.calculateTotalPrice(orderItems);

    const order = new Order(
      0,
      customerName,
      customerSurname,
      customerAddress,
      customerPhone,
      customerEmail,
      paymentMethod as PaymentMethod,
      totalPrice,
      OrderStatus.PENDING,
      orderItems,
      userId,
      new Date(),
      new Date(),
    );

    return await this.orderRepository.create(order);
  }
}
