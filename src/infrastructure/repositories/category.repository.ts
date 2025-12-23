import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICategoryRepository } from '@domain/repositories/category.repository.interface';
import { Category } from '@domain/entities/category.entity';
import { CategoryTypeormEntity } from '../database/entities/category.typeorm-entity';
import { CategoryMapper } from '../database/mappers/category.mapper';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryTypeormEntity)
    private readonly repository: Repository<CategoryTypeormEntity>,
  ) {}

  async findAll(): Promise<Category[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(CategoryMapper.toDomain);
  }

  async findById(id: string): Promise<Category | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const entity = await this.repository.findOne({ where: { slug } });
    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async create(category: Category): Promise<Category> {
    const entity = CategoryMapper.toTypeorm(category);
    const saved = await this.repository.save(entity);
    return CategoryMapper.toDomain(saved);
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const entity = CategoryMapper.toTypeormPartial(category);
    await this.repository.update(id, entity);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Category not found after update');
    }
    return CategoryMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async save(category: Category): Promise<Category> {
    const entity = CategoryMapper.toTypeorm(category);
    const saved = await this.repository.save(entity);
    return CategoryMapper.toDomain(saved);
  }
}
