import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByProductId(productId: string): Promise<Order[]>;
  findByUserId(userId: string): Promise<Order[]>;
  findByGuestEmail(guestEmail: string): Promise<Order[]>;
  create(order: Order): Promise<Order>;
  updateUserId(orderId: string, userId: string): Promise<void>;
  updateUserIdForGuestEmail(guestEmail: string, userId: string): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
