import { Order, OrderStatus } from '../entities/order.entity';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  create(order: Order): Promise<Order>;
  updateStatus(orderId: number, status: OrderStatus): Promise<void>;
  delete(orderId: number): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
