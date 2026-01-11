import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubcategoryDto {
  @ApiProperty({ example: 'Gaming Laptops', description: 'Subcategory title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Խաղային նոութբուքեր',
    description: 'Subcategory title in Armenian',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleAm?: string;

  @ApiProperty({
    example: 'Игровые ноутбуки',
    description: 'Subcategory title in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleRu?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Category ID that this subcategory belongs to', required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
