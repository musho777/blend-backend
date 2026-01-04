import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';

export interface OrderStatistics {
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
}

@Injectable()
export class GetOrderStatisticsUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(): Promise<OrderStatistics> {
    const allOrders = await this.orderRepository.findAll();

    // Calculate total orders and revenue
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Calculate orders by status
    const ordersByStatus = {
      pending: allOrders.filter(order => order.status === 'pending').length,
      rejected: allOrders.filter(order => order.status === 'rejected').length,
      success: allOrders.filter(order => order.status === 'success').length,
    };

    // Calculate monthly revenue
    const monthlyData = new Map<string, { revenue: number; orders: number }>();

    allOrders.forEach(order => {
      if (order.createdAt) {
        const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM format
        const existing = monthlyData.get(month) || { revenue: 0, orders: 0 };
        monthlyData.set(month, {
          revenue: existing.revenue + order.totalPrice,
          orders: existing.orders + 1,
        });
      }
    });

    // Convert map to sorted array (most recent first)
    const monthlyRevenue = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus,
      monthlyRevenue,
    };
  }
}
