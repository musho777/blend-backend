import { Subcategory } from '../entities/subcategory.entity';

export interface ISubcategoryRepository {
  findAll(): Promise<Subcategory[]>;
  findById(id: string): Promise<Subcategory | null>;
  findByCategoryId(categoryId: string): Promise<Subcategory[]>;
  create(subcategory: Subcategory): Promise<Subcategory>;
  update(id: string, subcategory: Partial<Subcategory>): Promise<Subcategory>;
  delete(id: string): Promise<void>;
  save(subcategory: Subcategory): Promise<Subcategory>;
}

export const SUBCATEGORY_REPOSITORY = Symbol('SUBCATEGORY_REPOSITORY');
