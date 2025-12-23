import { Product } from '../entities/product.entity';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findFeatured(): Promise<Product[]>;
  findBestSellers(): Promise<Product[]>;
  findBestSelect(): Promise<Product[]>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  save(product: Product): Promise<Product>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
