import { IsString, IsInt, IsNumber, Min, IsArray, IsEnum, ValidateNested, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CustomerDto {
  @ApiProperty({ example: 'MUHSO', description: 'Customer first name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'POGHOSYAN', description: 'Customer surname' })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ example: 'MOLDOVKAN 30/3', description: 'Customer address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '+37493613007', description: 'Customer phone' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class OrderItemDto {
  @ApiProperty({ example: 'd0264a72-ad1b-47f8-861a-df80d64b8e5a', description: 'Product ID' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity', minimum: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ example: 10, description: 'Product price' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 'New Product', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: CustomerDto, description: 'Customer information' })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: [OrderItemDto], description: 'Order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'cash_on_delivery', description: 'Payment method', enum: ['cash_on_delivery', 'card', 'online'] })
  @IsEnum(['cash_on_delivery', 'card', 'online'])
  paymentMethod: string;
}
