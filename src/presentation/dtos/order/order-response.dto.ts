import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus, PaymentMethod, OrderItem } from '@domain/entities/order.entity';

export class OrderItemResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Item ID' })
  id: string;

  @ApiProperty({ example: 'd0264a72-ad1b-47f8-861a-df80d64b8e5a', description: 'Product ID' })
  productId: string;

  @ApiProperty({ example: 'New Product', description: 'Product name' })
  name: string;

  @ApiProperty({ example: 10, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 2, description: 'Quantity' })
  quantity: number;

  @ApiProperty({ example: 20, description: 'Subtotal for this item' })
  subtotal: number;

  static fromDomain(item: OrderItem): OrderItemResponseDto {
    return {
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    };
  }
}

export class OrderResponseDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  id: number;

  @ApiProperty({ example: 'MUHSO', description: 'Customer first name' })
  customerName: string;

  @ApiProperty({ example: 'POGHOSYAN', description: 'Customer surname' })
  customerSurname: string;

  @ApiProperty({ example: 'MOLDOVKAN 30/3', description: 'Customer address' })
  customerAddress: string;

  @ApiProperty({ example: '+37493613007', description: 'Customer phone' })
  customerPhone: string;

  @ApiProperty({ example: 'cash_on_delivery', description: 'Payment method', enum: PaymentMethod })
  paymentMethod: string;

  @ApiProperty({ example: 100, description: 'Total order amount' })
  totalPrice: number;

  @ApiProperty({ example: 'pending', description: 'Order status', enum: OrderStatus })
  status: string;

  @ApiProperty({ type: [OrderItemResponseDto], description: 'Order items' })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Order creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T14:45:00Z', description: 'Last update timestamp' })
  updatedAt: string;

  static fromDomain(order: Order): OrderResponseDto {
    return {
      id: order.id,
      customerName: order.customerName,
      customerSurname: order.customerSurname,
      customerAddress: order.customerAddress,
      customerPhone: order.customerPhone,
      paymentMethod: order.paymentMethod,
      totalPrice: order.totalPrice,
      status: order.status,
      items: order.items.map(item => OrderItemResponseDto.fromDomain(item)),
      createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: order.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  static fromDomainArray(orders: Order[]): OrderResponseDto[] {
    return orders.map(order => this.fromDomain(order));
  }
}