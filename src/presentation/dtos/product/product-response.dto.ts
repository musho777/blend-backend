import { Product } from "@domain/entities/product.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ProductResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "iPhone 15 Pro" })
  title: string;

  @ApiProperty({ example: "iPhone 15 Pro", required: false })
  titleAm: string;

  @ApiProperty({ example: "iPhone 15 Pro", required: false })
  titleRu: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  categoryId: string;

  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000", required: false })
  subcategoryId: string | null;

  @ApiProperty({
    example: "High-quality smartphone with advanced camera features",
  })
  description: string;

  @ApiProperty({
    example: "Բարձրորակ սմարթֆոն առաջադեմ տեսախցիկի հնարավորություններով",
    required: false,
  })
  descriptionAm: string;

  @ApiProperty({
    example: "Высококачественный смартфон с расширенными возможностями камеры",
    required: false,
  })
  descriptionRu: string;

  @ApiProperty({
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    required: false,
    type: [String],
  })
  imageUrls: string[];

  @ApiProperty({ example: true })
  isFeatured: boolean;

  @ApiProperty({ example: false })
  isBestSeller: boolean;

  @ApiProperty({ example: false })
  isBestSelect: boolean;

  @ApiProperty({ example: 10 })
  priority: number;

  @ApiProperty({ example: false })
  disabled: boolean;

  @ApiProperty({ example: "2024-01-01T00:00:00.000Z", required: false })
  createdAt?: Date;

  @ApiProperty({ example: "2024-01-01T00:00:00.000Z", required: false })
  updatedAt?: Date;

  static fromDomain(product: Product): ProductResponseDto {
    return {
      id: product.id,
      title: product.title,
      titleAm: product.titleAm,
      titleRu: product.titleRu,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      description: product.description,
      descriptionAm: product.descriptionAm,
      descriptionRu: product.descriptionRu,
      imageUrls: product.imageUrls,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller,
      isBestSelect: product.isBestSelect,
      priority: product.priority,
      disabled: product.disabled,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static fromDomainArray(products: Product[]): ProductResponseDto[] {
    return products.map((product) => ProductResponseDto.fromDomain(product));
  }
}
