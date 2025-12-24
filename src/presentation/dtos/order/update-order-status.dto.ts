import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
    enumName: 'OrderStatus',
  })
  @IsEnum(OrderStatus, {
    message: 'Status must be one of: pending, processing, shipped, delivered, cancelled'
  })
  status: OrderStatus;
}