import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOrderRepository } from '@domain/repositories/order.repository.interface';
import { Order, OrderStatus } from '@domain/entities/order.entity';
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
      relations: ['items'],
    });
    return entities.map(OrderMapper.toDomain);
  }

  async findById(id: number): Promise<Order | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['items'],
    });
    return entity ? OrderMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });
    return entities.map(OrderMapper.toDomain);
  }

  async create(order: Order): Promise<Order> {
    const entity = OrderMapper.toTypeorm(order);
    const saved = await this.repository.save(entity);
    return OrderMapper.toDomain(saved);
  }

  async updateStatus(orderId: number, status: OrderStatus): Promise<void> {
    await this.repository.update(orderId, { status });
  }

  async delete(orderId: number): Promise<void> {
    await this.repository.delete(orderId);
  }
}
