import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  Inject,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "@auth/guards/optional-jwt-auth.guard";
import { UserJwtAuthGuard } from "@auth/guards/user-jwt-auth.guard";
import { CreateOrderDto } from "../dtos/order/create-order.dto";
import { UpdateOrderStatusDto } from "../dtos/order/update-order-status.dto";
import { OrderResponseDto } from "../dtos/order/order-response.dto";
import { CreateOrderUseCase } from "@application/use-cases/order/create-order.use-case";
import { GetAllOrdersUseCase } from "@application/use-cases/order/get-all-orders.use-case";
import { GetOrderByIdUseCase } from "@application/use-cases/order/get-order-by-id.use-case";
import { UpdateOrderStatusUseCase } from "@application/use-cases/order/update-order-status.use-case";
import { DeleteOrderUseCase } from "@application/use-cases/order/delete-order.use-case";
import { GetOrderStatisticsUseCase } from "@application/use-cases/order/get-order-statistics.use-case";
import { IOrderRepository, ORDER_REPOSITORY } from "@domain/repositories/order.repository.interface";

@ApiTags("Orders")
@ApiBearerAuth("JWT-auth")
@Controller("orders")
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
    private readonly getOrderStatisticsUseCase: GetOrderStatisticsUseCase,
  ) {}
  
  @Get()
  @ApiOperation({ 
    summary: "Get all orders",
    description: "Admin can view all orders with optional status filtering and pagination"
  })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter orders by status",
    enum: ["pending", "rejected", "success"],
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (starting from 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of orders per page",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "List of orders",
    schema: {
      type: "object",
      properties: {
        orders: {
          type: "array",
          items: { $ref: "#/components/schemas/OrderResponseDto" },
        },
        pagination: {
          type: "object",
          properties: {
            page: { type: "number", example: 1 },
            limit: { type: "number", example: 10 },
            total: { type: "number", example: 100 },
            pages: { type: "number", example: 10 },
          },
        },
      },
    },
  })
  async findAll(
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ): Promise<{
    orders: OrderResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const allOrders = await this.getAllOrdersUseCase.execute();

    let filteredOrders = allOrders;
    if (status) {
      filteredOrders = allOrders.filter(order => order.status === status);
    }

    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    const total = filteredOrders.length;
    const pages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      orders: OrderResponseDto.fromDomainArray(paginatedOrders),
      pagination: { page: pageNum, limit: limitNum, total, pages },
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get order by ID",
    description: "Admin can view detailed information about a specific order"
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order found",
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid ID" })
  @ApiResponse({ status: 404, description: "Order not found" })
  async findOne(@Param("id") id: string): Promise<OrderResponseDto> {
    const order = await this.getOrderByIdUseCase.execute(+id);
    return OrderResponseDto.fromDomain(order);
  }

  @Patch(":id/status")
  @ApiOperation({
    summary: "Update order status",
    description: "Admin can update the status of an order (pending → rejected/success)"
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully",
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid status transition" })
  @ApiResponse({ status: 404, description: "Order not found" })
  async updateStatus(
    @Param("id") id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ): Promise<OrderResponseDto> {
    const order = await this.updateOrderStatusUseCase.execute(+id, updateOrderStatusDto.status);
    return OrderResponseDto.fromDomain(order);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete order",
    description: "Admin can delete an order (only pending orders should be deletable)"
  })
  @ApiParam({ name: "id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Order deleted successfully",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Order deleted successfully" }
      }
    }
  })
  @ApiResponse({ status: 400, description: "Cannot delete order with this status" })
  @ApiResponse({ status: 404, description: "Order not found" })
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.deleteOrderUseCase.execute(+id);
    return { message: "Order deleted successfully" };
  }

  @Get("statistics/dashboard")
  @ApiOperation({
    summary: "Get order statistics for dashboard",
    description: "Admin dashboard statistics including total orders, revenue, order status breakdown"
  })
  @ApiResponse({
    status: 200,
    description: "Order statistics",
    schema: {
      type: "object",
      properties: {
        totalOrders: { type: "number", example: 150 },
        totalRevenue: { type: "number", example: 25000.50 },
        ordersByStatus: {
          type: "object",
          properties: {
            pending: { type: "number", example: 10 },
            rejected: { type: "number", example: 5 },
            success: { type: "number", example: 120 },
          },
        },
        monthlyRevenue: {
          type: "array",
          items: {
            type: "object",
            properties: {
              month: { type: "string", example: "2024-01" },
              revenue: { type: "number", example: 5000.00 },
              orders: { type: "number", example: 25 },
            },
          },
        },
      },
    },
  })
  async getDashboardStatistics(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: {
      pending: number;
      rejected: number;
      success: number;
    };
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      orders: number;
    }>;
  }> {
    return await this.getOrderStatisticsUseCase.execute();
  }
}

@ApiTags('Public Orders')
@Controller('public/orders')
export class PublicOrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Create order',
    description: 'Create a new order with customer information and multiple items. Authenticated users will have the order linked to their account.'
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request (e.g., invalid data, insufficient stock)' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: any,
  ): Promise<OrderResponseDto> {
    const userId = req.user?.userId;

    const order = await this.createOrderUseCase.execute({
      customerName: createOrderDto.customer.name,
      customerSurname: createOrderDto.customer.surname,
      customerAddress: createOrderDto.customer.address,
      customerPhone: createOrderDto.customer.phone,
      customerEmail: createOrderDto.customer.email,
      items: createOrderDto.items,
      paymentMethod: createOrderDto.paymentMethod,
      userId,
    });

    return OrderResponseDto.fromDomain(order);
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
    type: [OrderResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyOrders(@Req() req: any): Promise<OrderResponseDto[]> {
    const userId = req.user?.userId;
    const orders = await this.orderRepository.findByUserId(userId);
    return OrderResponseDto.fromDomainArray(orders);
  }
}