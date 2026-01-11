import { Subcategory } from '@domain/entities/subcategory.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SubcategoryResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Laptops' })
  title: string;

  @ApiProperty({ example: 'Նոութբուքեր', required: false })
  titleAm: string;

  @ApiProperty({ example: 'Ноутбуки', required: false })
  titleRu: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  categoryId: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  createdAt?: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  updatedAt?: Date;

  static fromDomain(subcategory: Subcategory): SubcategoryResponseDto {
    return {
      id: subcategory.id,
      title: subcategory.title,
      titleAm: subcategory.titleAm,
      titleRu: subcategory.titleRu,
      categoryId: subcategory.categoryId,
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    };
  }

  static fromDomainArray(subcategories: Subcategory[]): SubcategoryResponseDto[] {
    return subcategories.map(subcategory => SubcategoryResponseDto.fromDomain(subcategory));
  }
}
