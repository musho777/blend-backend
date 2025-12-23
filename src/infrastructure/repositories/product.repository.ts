import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { Product } from '@domain/entities/product.entity';
import { ProductTypeormEntity } from '../database/entities/product.typeorm-entity';
import { ProductMapper } from '../database/mappers/product.mapper';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductTypeormEntity)
    private readonly repository: Repository<ProductTypeormEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find({
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findFeatured(): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { isFeatured: true },
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findBestSellers(): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { isBestSeller: true },
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findBestSelect(): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { isBestSelect: true },
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { categoryId },
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async create(product: Product): Promise<Product> {
    const entity = ProductMapper.toTypeorm(product);
    const saved = await this.repository.save(entity);
    return ProductMapper.toDomain(saved);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const entity = ProductMapper.toTypeormPartial(product);
    await this.repository.update(id, entity);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Product not found after update');
    }
    return ProductMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async save(product: Product): Promise<Product> {
    const entity = ProductMapper.toTypeorm(product);
    const saved = await this.repository.save(entity);
    return ProductMapper.toDomain(saved);
  }
}
