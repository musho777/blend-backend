import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum OrderStatusEnum {
  PENDING = 'pending',
  REJECTED = 'rejected',
  SUCCESS = 'success',
}

enum PaymentMethodEnum {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  CARD = 'card',
  ONLINE = 'online',
}

export class ExportOrdersQueryDto {
  @ApiProperty({
    required: false,
    enum: OrderStatusEnum,
    description: 'Filter orders by status',
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Filter orders from this date (ISO format: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    required: false,
    description: 'Filter orders until this date (ISO format: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    required: false,
    enum: PaymentMethodEnum,
    description: 'Filter orders by payment method',
  })
  @IsOptional()
  @IsEnum(PaymentMethodEnum)
  paymentMethod?: string;

  @ApiProperty({
    required: false,
    description: 'Filter orders by customer email (exact match)',
    example: 'customer@example.com',
  })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiProperty({
    required: false,
    description: 'Filter orders by customer phone (partial match)',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({
    required: false,
    description: 'Minimum order total price',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minTotal?: number;

  @ApiProperty({
    required: false,
    description: 'Maximum order total price',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxTotal?: number;
}
