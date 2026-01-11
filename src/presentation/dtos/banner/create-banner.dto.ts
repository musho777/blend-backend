import { IsString, IsOptional, IsBoolean, MaxLength, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ example: '/uploads/banners/banner1.jpg', description: 'Banner image URL (set automatically when image file is uploaded)', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: '/products?category=electronics', description: 'Destination URL for the banner link' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'New Electronics Collection - Up to 50% Off', description: 'Promotional text overlay', required: false, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;

  @ApiProperty({ example: 'Նոր էլեկտրոնիկա - մինչև 50% զեղչ', description: 'Promotional text overlay in Armenian', required: false, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  textAm?: string;

  @ApiProperty({ example: 'Новая электроника - до 50% скидка', description: 'Promotional text overlay in Russian', required: false, maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  textRu?: string;

  @ApiProperty({ example: true, description: 'Controls if banner is shown on the website', default: true, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, description: 'Display order priority (lower numbers appear first)', default: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsInt()
  @Min(1)
  priority?: number;
}
