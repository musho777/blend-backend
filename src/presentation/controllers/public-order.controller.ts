import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateOrderDto } from '@presentation/dtos/order/create-order.dto';
import { SimpleOrderResponseDto } from '@presentation/dtos/order/simple-order-response.dto';
import { CreateOrderUseCase } from '@application/use-cases/order/create-order.use-case';
import { OptionalJwtAuthGuard } from '@auth/guards/optional-jwt-auth.guard';
import { UserJwtAuthGuard } from '@auth/guards/user-jwt-auth.guard';

@ApiTags('Public Orders')
@Controller('public/orders')
export class PublicOrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
  ) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Create order',
    description: 'Create a new order. Authenticated users will have the order linked to their account. Guest users must provide an email.'
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: SimpleOrderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., guest email missing, insufficient stock)' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: any,
  ): Promise<SimpleOrderResponseDto> {
    const userId = req.user?.userId;
    const { productId, quantity, guestEmail } = createOrderDto;

    const order = await this.createOrderUseCase.execute({
      productId,
      quantity,
      userId,
      guestEmail: userId ? undefined : guestEmail,
    });

    return {
      id: order.id,
      productId: order.productId,
      quantity: order.quantity,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
    };
  }

  @Get('my-orders')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get my orders',
    description: 'Get all orders for the authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'List of user orders',
    type: [SimpleOrderResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyOrders(@Req() req: any): Promise<SimpleOrderResponseDto[]> {
    // TODO: Implement get user orders use case
    return [];
  }
}
