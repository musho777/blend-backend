import { Product } from '@domain/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro' })
  title: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  categoryId: string;

  @ApiProperty({ example: true })
  isFeatured: boolean;

  @ApiProperty({ example: false })
  isBestSeller: boolean;

  @ApiProperty({ example: false })
  isBestSelect: boolean;

  @ApiProperty({ example: 10 })
  priority: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  createdAt?: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  updatedAt?: Date;

  static fromDomain(product: Product): ProductResponseDto {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isBestSelect: product.isBestSelect,
      priority: product.priority,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static fromDomainArray(products: Product[]): ProductResponseDto[] {
    return products.map(product => ProductResponseDto.fromDomain(product));
  }
}
