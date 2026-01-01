import { ApiProperty } from '@nestjs/swagger';

export class SimpleOrderResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Order UUID' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Product UUID' })
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  quantity: number;

  @ApiProperty({ example: 1999.98, description: 'Total price' })
  totalPrice: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Order creation timestamp' })
  createdAt: string;
}
