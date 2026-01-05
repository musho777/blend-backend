import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
  PaginationOptions,
  PaginatedResult,
} from "@domain/repositories/product.repository.interface";
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from "@domain/repositories/category.repository.interface";
import { Product } from "@domain/entities/product.entity";
import { ProductSortBy } from "@presentation/dtos/category/get-products-by-category-query.dto";

@Injectable()
export class GetProductsByCategoryUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(categoryId: string): Promise<Product[]> {
    await this.validateCategory(categoryId);
    return await this.productRepository.findByCategoryId(categoryId);
  }

  async executePaginated(
    categoryId: string,
    options: PaginationOptions,
    subcategoryId?: string,
    search?: string,
    sortBy?: ProductSortBy,
    minPrice?: number,
    maxPrice?: number
  ): Promise<PaginatedResult<Product>> {
    await this.validateCategory(categoryId);
    return await this.productRepository.findByCategoryIdPaginated(
      categoryId,
      options,
      subcategoryId,
      search,
      sortBy,
      minPrice,
      maxPrice
    );
  }

  private async validateCategory(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
  }
}
