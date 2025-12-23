import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByProductId(productId: string): Promise<Order[]>;
  create(order: Order): Promise<Order>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
