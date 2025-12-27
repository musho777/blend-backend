import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISubcategoryRepository } from '@domain/repositories/subcategory.repository.interface';
import { Subcategory } from '@domain/entities/subcategory.entity';
import { SubcategoryTypeormEntity } from '../database/entities/subcategory.typeorm-entity';
import { SubcategoryMapper } from '../database/mappers/subcategory.mapper';

@Injectable()
export class SubcategoryRepository implements ISubcategoryRepository {
  constructor(
    @InjectRepository(SubcategoryTypeormEntity)
    private readonly repository: Repository<SubcategoryTypeormEntity>,
  ) {}

  async findAll(): Promise<Subcategory[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(SubcategoryMapper.toDomain);
  }

  async findById(id: string): Promise<Subcategory | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? SubcategoryMapper.toDomain(entity) : null;
  }

  async findByCategoryId(categoryId: string): Promise<Subcategory[]> {
    const entities = await this.repository.find({
      where: { categoryId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(SubcategoryMapper.toDomain);
  }

  async create(subcategory: Subcategory): Promise<Subcategory> {
    const entity = SubcategoryMapper.toTypeorm(subcategory);
    const saved = await this.repository.save(entity);
    return SubcategoryMapper.toDomain(saved);
  }

  async update(id: string, subcategory: Partial<Subcategory>): Promise<Subcategory> {
    const entity = SubcategoryMapper.toTypeormPartial(subcategory);
    await this.repository.update(id, entity);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Subcategory not found after update');
    }
    return SubcategoryMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async save(subcategory: Subcategory): Promise<Subcategory> {
    const entity = SubcategoryMapper.toTypeorm(subcategory);
    const saved = await this.repository.save(entity);
    return SubcategoryMapper.toDomain(saved);
  }
}
