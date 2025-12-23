import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 999.99, description: 'Product price', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock quantity', minimum: 0 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Category UUID' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: true, description: 'Is product featured', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: false, description: 'Is product a best seller', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @ApiProperty({ example: false, description: 'Is product a best select', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isBestSelect?: boolean;

  @ApiProperty({ example: 10, description: 'Display priority (higher = first)', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number;
}
