import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro Max', description: 'Product title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 1099.99, description: 'Product price', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ example: 30, description: 'Available stock quantity', minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Category UUID', required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ example: true, description: 'Is product featured', required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: false, description: 'Is product a best seller', required: false })
  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @ApiProperty({ example: false, description: 'Is product a best select', required: false })
  @IsOptional()
  @IsBoolean()
  isBestSelect?: boolean;

  @ApiProperty({ example: 20, description: 'Display priority', required: false })
  @IsOptional()
  @IsNumber()
  priority?: number;
}
