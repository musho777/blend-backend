import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../common/pagination.dto';

export class GetProductsByCategoryQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Subcategory UUID to filter products',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  subcategoryId?: string;
}
