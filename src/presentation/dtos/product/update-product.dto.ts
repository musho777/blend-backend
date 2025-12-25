import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, Min, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class UpdateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro Max', description: 'Product title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 1099.99, description: 'Product price', minimum: 0, required: false })
  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : value)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 30, description: 'Available stock quantity', minimum: 0, required: false })
  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : value)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Category UUID', required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ 
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'], 
    description: 'Existing product image URLs to keep', 
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({ 
    example: ['https://example.com/image3.jpg'], 
    description: 'Image URLs to remove from product', 
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagesToRemove?: string[];

  @ApiProperty({ example: true, description: 'Is product featured', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: false, description: 'Is product a best seller', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  @IsBoolean()
  isBestSeller?: boolean;

  @ApiProperty({ example: false, description: 'Is product a best select', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  @IsBoolean()
  isBestSelect?: boolean;

  @ApiProperty({ example: 20, description: 'Display priority', required: false })
  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : value)
  @Type(() => Number)
  @IsNumber()
  priority?: number;
}
