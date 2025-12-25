import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY, PaginationOptions, PaginatedResult } from '@domain/repositories/product.repository.interface';
import { Product } from '@domain/entities/product.entity';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async executePaginated(options: PaginationOptions): Promise<PaginatedResult<Product>> {
    return await this.productRepository.findAllPaginated(options);
  }
}
