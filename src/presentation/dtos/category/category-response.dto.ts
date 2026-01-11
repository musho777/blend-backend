import { Category } from '@domain/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Electronics' })
  title: string;

  @ApiProperty({ example: 'Էլեկտրոնիկա', required: false })
  titleAm: string;

  @ApiProperty({ example: 'Электроника', required: false })
  titleRu: string;

  @ApiProperty({ example: 'electronics' })
  slug: string;

  @ApiProperty({ example: 'https://example.com/images/electronics.jpg' })
  image: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  createdAt?: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  updatedAt?: Date;

  static fromDomain(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      title: category.title,
      titleAm: category.titleAm,
      titleRu: category.titleRu,
      slug: category.slug,
      image: category.image,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  static fromDomainArray(categories: Category[]): CategoryResponseDto[] {
    return categories.map(category => CategoryResponseDto.fromDomain(category));
  }
}
