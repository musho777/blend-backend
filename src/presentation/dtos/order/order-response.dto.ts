import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from './update-order-status.dto';

export class OrderItemResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Product UUID' })
  productId: string;

  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product title' })
  productTitle: string;

  @ApiProperty({ example: 999.99, description: 'Product price at time of order' })
  price: number;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  quantity: number;

  @ApiProperty({ example: 1999.98, description: 'Total price for this item' })
  totalPrice: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Order UUID' })
  id: string;

  @ApiProperty({ example: 'ORD-2024-001', description: 'Human-readable order number' })
  orderNumber: string;

  @ApiProperty({ example: 'John Doe', description: 'Customer full name' })
  customerName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Customer email address' })
  customerEmail: string;

  @ApiProperty({ example: '+1234567890', description: 'Customer phone number' })
  customerPhone: string;

  @ApiProperty({
    description: 'Customer shipping address',
    type: 'object',
    properties: {
      street: { type: 'string', example: '123 Main St' },
      city: { type: 'string', example: 'New York' },
      state: { type: 'string', example: 'NY' },
      zipCode: { type: 'string', example: '10001' },
      country: { type: 'string', example: 'USA' },
    }
  })
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @ApiProperty({
    description: 'Ordered items',
    type: [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: 2099.97, description: 'Subtotal before tax and shipping' })
  subtotal: number;

  @ApiProperty({ example: 199.99, description: 'Tax amount' })
  tax: number;

  @ApiProperty({ example: 9.99, description: 'Shipping cost' })
  shippingCost: number;

  @ApiProperty({ example: 2309.95, description: 'Total order amount' })
  total: number;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
  })
  status: OrderStatus;

  @ApiProperty({ example: 'credit_card', description: 'Payment method used' })
  paymentMethod: string;

  @ApiProperty({ example: 'TRX123456789', description: 'Payment transaction ID' })
  paymentTransactionId?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Order creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T14:45:00Z', description: 'Last update timestamp' })
  updatedAt: string;

  @ApiProperty({ example: '2024-01-16T09:00:00Z', description: 'Estimated delivery date', required: false })
  estimatedDelivery?: string;

  @ApiProperty({ example: 'TRK123456789', description: 'Shipping tracking number', required: false })
  trackingNumber?: string;

  @ApiProperty({ example: 'Order processed and shipped', description: 'Admin notes', required: false })
  notes?: string;

  // TODO: Add static methods for domain mapping when Order entity is available
  // static fromDomain(order: Order): OrderResponseDto
  // static fromDomainArray(orders: Order[]): OrderResponseDto[]
}