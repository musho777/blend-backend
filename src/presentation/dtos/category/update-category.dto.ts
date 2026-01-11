import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Consumer Electronics', description: 'Category title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Սպառողական էլեկտրոնիկա',
    description: 'Category title in Armenian',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleAm?: string;

  @ApiProperty({
    example: 'Потребительская электроника',
    description: 'Category title in Russian',
    required: false,
  })
  @IsOptional()
  @IsString()
  titleRu?: string;

  @ApiProperty({ example: 'consumer-electronics', description: 'URL-friendly slug', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'https://example.com/images/consumer-electronics.jpg', description: 'Category image URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
