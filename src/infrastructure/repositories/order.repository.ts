import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOrderRepository } from '@domain/repositories/order.repository.interface';
import { Order } from '@domain/entities/order.entity';
import { OrderTypeormEntity } from '../database/entities/order.typeorm-entity';
import { OrderMapper } from '../database/mappers/order.mapper';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderTypeormEntity)
    private readonly repository: Repository<OrderTypeormEntity>,
  ) {}

  async findAll(): Promise<Order[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(OrderMapper.toDomain);
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findByProductId(productId: string): Promise<Order[]> {
    const entities = await this.repository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(OrderMapper.toDomain);
  }

  async create(order: Order): Promise<Order> {
    const entity = OrderMapper.toTypeorm(order);
    const saved = await this.repository.save(entity);
    return OrderMapper.toDomain(saved);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(OrderMapper.toDomain);
  }

  async findByGuestEmail(guestEmail: string): Promise<Order[]> {
    const entities = await this.repository.find({
      where: { guestEmail },
      order: { createdAt: 'DESC' },
    });
    return entities.map(OrderMapper.toDomain);
  }

  async updateUserId(orderId: string, userId: string): Promise<void> {
    await this.repository.update(orderId, { userId });
  }

  async updateUserIdForGuestEmail(guestEmail: string, userId: string): Promise<void> {
    await this.repository.update({ guestEmail }, { userId });
  }
}
