import { IsString, IsOptional, IsBoolean, MaxLength, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBannerDto {
  @ApiProperty({ example: '/uploads/banners/banner1.jpg', description: 'Banner image URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: '/products?category=fashion', description: 'Destination URL for the banner link', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ example: 'Fashion Sale - Limited Time Only', description: 'Promotional text overlay', required: false, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;

  @ApiProperty({ example: 'Նորաձևության զեղչեր - սահմանափակ ժամկետով', description: 'Promotional text overlay in Armenian', required: false, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  textAm?: string;

  @ApiProperty({ example: 'Распродажа моды - ограниченное время', description: 'Promotional text overlay in Russian', required: false, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  textRu?: string;

  @ApiProperty({ example: false, description: 'Controls if banner is shown on the website', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, description: 'Display order priority (lower numbers appear first)', required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  @Min(1)
  priority?: number;
}
