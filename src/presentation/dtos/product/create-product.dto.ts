import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  Min,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

export class CreateProductDto {
  @ApiProperty({ example: "iPhone 15 Pro", description: "Product title (English)" })
  @IsString()
  title: string;

  @ApiProperty({
    example: "iPhone 15 Pro",
    description: "Product title in Armenian",
    required: false,
  })
  @IsOptional()
  @IsString()
  titleAm?: string;

  @ApiProperty({
    example: "iPhone 15 Pro",
    description: "Product title in Russian",
    required: false,
  })
  @IsOptional()
  @IsString()
  titleRu?: string;

  @ApiProperty({ example: 999.99, description: "Product price", minimum: 0 })
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 50,
    description: "Available stock quantity",
    minimum: 0,
  })
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Category UUID",
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Subcategory UUID (optional, must belong to selected category)",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  subcategoryId?: string;

  @ApiProperty({
    example: "High-quality smartphone with advanced camera features",
    description: "Product description (English)",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "Բարձրորակ սմարթֆոն առաջադեմ տեսախցիկի հնարավորություններով",
    description: "Product description in Armenian",
    required: false,
  })
  @IsOptional()
  @IsString()
  descriptionAm?: string;

  @ApiProperty({
    example: "Высококачественный смартфон с расширенными возможностями камеры",
    description: "Product description in Russian",
    required: false,
  })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiProperty({
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    description: "Product image URLs",
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({
    example: true,
    description: "Is product featured",
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return Boolean(value);
  })
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    example: false,
    description: "Is product a best seller",
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return Boolean(value);
  })
  @IsBoolean()
  isBestSeller?: boolean;

  @ApiProperty({
    example: false,
    description: "Is product a best select",
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return Boolean(value);
  })
  @IsBoolean()
  isBestSelect?: boolean;

  @ApiProperty({
    example: 10,
    description: "Display priority (higher = first)",
    required: false,
    default: 0,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsNumber()
  priority?: number;

  @ApiProperty({
    example: false,
    description: "Is product disabled (hidden from public)",
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return Boolean(value);
  })
  @IsBoolean()
  disabled?: boolean;
}
