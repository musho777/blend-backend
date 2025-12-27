import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubcategoryDto {
  @ApiProperty({ example: 'Gaming Laptops', description: 'Subcategory title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Category ID that this subcategory belongs to', required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
