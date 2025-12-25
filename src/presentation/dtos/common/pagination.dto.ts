import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Page number (starting from 1)',
    minimum: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  get skip(): number {
    return ((this.page || 1) - 1) * (this.limit || 10);
  }

  get take(): number {
    return this.limit || 10;
  }
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items' })
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      pages: 10,
      hasNext: true,
      hasPrevious: false,
    },
  })
  meta: PaginationMeta;

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data;
    this.meta = meta;
  }

  static create<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponseDto<T> {
    const pages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrevious: page > 1,
    };

    return new PaginatedResponseDto(data, meta);
  }
}