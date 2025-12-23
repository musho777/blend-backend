import { Order } from '@domain/entities/order.entity';
import { OrderTypeormEntity } from '../entities/order.typeorm-entity';

export class OrderMapper {
  static toDomain(entity: OrderTypeormEntity): Order {
    return new Order(
      entity.id,
      entity.productId,
      entity.quantity,
      Number(entity.totalPrice),
      entity.createdAt,
    );
  }

  static toTypeorm(domain: Order): OrderTypeormEntity {
    const entity = new OrderTypeormEntity();
    entity.id = domain.id;
    entity.productId = domain.productId;
    entity.quantity = domain.quantity;
    entity.totalPrice = domain.totalPrice;
    return entity;
  }
}
