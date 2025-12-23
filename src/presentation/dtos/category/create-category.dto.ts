import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Category title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'electronics', description: 'URL-friendly slug (auto-generated if not provided)', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'https://example.com/images/electronics.jpg', description: 'Category image URL' })
  @IsString()
  image: string;
}
