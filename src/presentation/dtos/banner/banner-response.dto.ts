import { Banner } from '@domain/entities/banner.entity';
import { ApiProperty } from '@nestjs/swagger';

export class BannerResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '/uploads/banners/banner1.jpg' })
  image: string;

  @ApiProperty({ example: '/products?category=electronics' })
  url: string;

  @ApiProperty({ example: 'New Electronics Collection - Up to 50% Off', nullable: true })
  text: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 1, description: 'Display order priority (lower numbers appear first)' })
  priority: number;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z', required: false })
  createdAt?: Date;

  @ApiProperty({ example: '2025-01-15T10:00:00.000Z', required: false })
  updatedAt?: Date;

  static fromDomain(banner: Banner): BannerResponseDto {
    return {
      id: banner.id,
      image: banner.image,
      url: banner.url,
      text: banner.text,
      isActive: banner.isActive,
      priority: banner.priority,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    };
  }

  static fromDomainArray(banners: Banner[]): BannerResponseDto[] {
    return banners.map(banner => BannerResponseDto.fromDomain(banner));
  }
}
