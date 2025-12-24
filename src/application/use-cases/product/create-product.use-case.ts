import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import { Product } from '@domain/entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreateProductDto {
  title: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrls?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isBestSelect?: boolean;
  priority?: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const product = new Product(
      uuidv4(),
      dto.title,
      dto.price,
      dto.stock,
      dto.categoryId,
      dto.imageUrls || [],
      dto.isFeatured || false,
      dto.isBestSeller || false,
      dto.isBestSelect || false,
      dto.priority || 0,
    );

    return await this.productRepository.create(product);
  }
}
