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
  @ApiProperty({ example: "iPhone 15 Pro", description: "Product title" })
  @IsString()
  title: string;

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
}
