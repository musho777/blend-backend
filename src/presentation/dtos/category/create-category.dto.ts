import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Category title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Էլեկտրոնիկա',
    description: 'Category title in Armenian',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleAm?: string;

  @ApiProperty({
    example: 'Электроника',
    description: 'Category title in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleRu?: string;

  @ApiProperty({ example: 'electronics', description: 'URL-friendly slug (auto-generated if not provided)', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'https://example.com/images/electronics.jpg', description: 'Category image URL (set automatically when image file is uploaded)', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 1, description: 'Order index for sorting categories (default: 0)', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  orderIndex?: number;
}
