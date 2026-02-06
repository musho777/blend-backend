import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../common/pagination.dto';

export class GetProductsQueryDto extends PaginationDto {
  @ApiProperty({
    example: 'iPhone',
    description: 'Search products by name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
