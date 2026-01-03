import { Order, OrderStatus, PaymentMethod, OrderItem } from '@domain/entities/order.entity';
import { OrderTypeormEntity, OrderItemTypeormEntity } from '../entities/order.typeorm-entity';

export class OrderItemMapper {
  static toDomain(entity: OrderItemTypeormEntity): OrderItem {
    return new OrderItem(
      entity.id,
      entity.orderId,
      entity.productId,
      entity.quantity,
      Number(entity.price),
      entity.name,
    );
  }

  static toTypeorm(domain: OrderItem): OrderItemTypeormEntity {
    const entity = new OrderItemTypeormEntity();
    entity.id = domain.id;
    entity.orderId = domain.orderId;
    entity.productId = domain.productId;
    entity.quantity = domain.quantity;
    entity.price = domain.price;
    entity.name = domain.name;
    return entity;
  }
}

export class OrderMapper {
  static toDomain(entity: OrderTypeormEntity): Order {
    const items = entity.items ? entity.items.map(item => OrderItemMapper.toDomain(item)) : [];

    return new Order(
      entity.id,
      entity.customerName,
      entity.customerSurname,
      entity.customerAddress,
      entity.customerPhone,
      entity.paymentMethod as PaymentMethod,
      Number(entity.totalPrice),
      entity.status as OrderStatus,
      items,
      entity.userId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toTypeorm(domain: Order): OrderTypeormEntity {
    const entity = new OrderTypeormEntity();
    entity.id = domain.id;
    entity.customerName = domain.customerName;
    entity.customerSurname = domain.customerSurname;
    entity.customerAddress = domain.customerAddress;
    entity.customerPhone = domain.customerPhone;
    entity.paymentMethod = domain.paymentMethod;
    entity.totalPrice = domain.totalPrice;
    entity.status = domain.status;
    entity.userId = domain.userId;
    entity.items = domain.items.map(item => OrderItemMapper.toTypeorm(item));
    return entity;
  }
}
