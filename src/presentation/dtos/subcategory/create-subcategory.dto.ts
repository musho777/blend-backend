import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Laptops', description: 'Subcategory title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Նոութբուքեր',
    description: 'Subcategory title in Armenian',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleAm?: string;

  @ApiProperty({
    example: 'Ноутбуки',
    description: 'Subcategory title in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleRu?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Category ID that this subcategory belongs to' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 1, description: 'Order index for sorting subcategories (default: 0)', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  orderIndex?: number;
}
