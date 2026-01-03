import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@domain/entities/order.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
    example: OrderStatus.REJECTED,
    enumName: 'OrderStatus',
  })
  @IsEnum(OrderStatus, {
    message: 'Status must be one of: pending, rejected, success'
  })
  status: OrderStatus;
}