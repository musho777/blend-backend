import { Product } from '../entities/product.entity';
import { ProductSortBy } from '@presentation/dtos/category/get-products-by-category-query.dto';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findAllPaginated(options: PaginationOptions, search?: string): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  findFeatured(): Promise<Product[]>;
  findBestSellers(): Promise<Product[]>;
  findBestSelect(): Promise<Product[]>;
  findByCategoryId(categoryId: string): Promise<Product[]>;
  findByCategoryIdPaginated(categoryId: string, options: PaginationOptions, subcategoryId?: string, search?: string, sortBy?: ProductSortBy, minPrice?: number, maxPrice?: number): Promise<PaginatedResult<Product>>;
  findRandomByCategoryId(categoryId: string, limit: number, excludeProductId?: string): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  save(product: Product): Promise<Product>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
