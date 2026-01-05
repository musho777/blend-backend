import { IsOptional, IsString, IsUUID, IsIn, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../common/pagination.dto';
import { Type, Transform } from 'class-transformer';

export enum ProductSortBy {
  DEFAULT = 'default',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRICE_HIGH_TO_LOW = 'price_high_to_low',
  PRICE_LOW_TO_HIGH = 'price_low_to_high',
}

export class GetProductsByCategoryQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Subcategory UUID to filter products',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  subcategoryId?: string;

  @ApiProperty({
    required: false,
    description: 'Search products by name',
    example: 'iPhone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Sort products by',
    enum: ProductSortBy,
    example: ProductSortBy.DEFAULT,
  })
  @IsOptional()
  @IsIn(Object.values(ProductSortBy))
  sortBy?: ProductSortBy;

  @ApiProperty({
    required: false,
    description: 'Minimum price filter',
    example: 0,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  })
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    required: false,
    description: 'Maximum price filter',
    example: 1000,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return Number(value);
  })
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
