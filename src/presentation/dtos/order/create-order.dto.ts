import { IsString, IsInt, Min, IsEmail, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    example: 'guest@example.com',
    description: 'Guest email (required if not authenticated)'
  })
  @IsOptional()
  @IsEmail()
  @ValidateIf((o) => !o.isAuthenticated)
  guestEmail?: string;
}
