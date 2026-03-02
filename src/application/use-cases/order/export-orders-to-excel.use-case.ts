import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { ExcelExportService, ExcelOrderRow } from '@common/services/excel-export.service';
import { ExportOrdersQueryDto } from '@presentation/dtos/order/export-orders-query.dto';

@Injectable()
export class ExportOrdersToExcelUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly excelExportService: ExcelExportService,
  ) {}

  async execute(filters: ExportOrdersQueryDto): Promise<Buffer> {
    let orders = await this.orderRepository.findAll();

    if (filters.status) {
      orders = orders.filter((order) => order.status === filters.status);
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      start.setHours(0, 0, 0, 0);
      orders = orders.filter((order) => {
        const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
        return orderDate >= start;
      });
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      orders = orders.filter((order) => {
        const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
        return orderDate <= end;
      });
    }

    if (filters.paymentMethod) {
      orders = orders.filter((order) => order.paymentMethod === filters.paymentMethod);
    }

    if (filters.customerEmail) {
      orders = orders.filter(
        (order) =>
          order.customerEmail?.toLowerCase() === filters.customerEmail?.toLowerCase(),
      );
    }

    if (filters.customerPhone) {
      orders = orders.filter((order) =>
        order.customerPhone.includes(filters.customerPhone || ''),
      );
    }

    if (filters.minTotal !== undefined) {
      orders = orders.filter((order) => order.totalPrice >= (filters.minTotal || 0));
    }

    if (filters.maxTotal !== undefined) {
      orders = orders.filter((order) => order.totalPrice <= (filters.maxTotal || 0));
    }

    const rows: ExcelOrderRow[] = [];
    orders.forEach((order) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          rows.push({
            orderId: order.id,
            orderDate: order.createdAt || new Date(),
            orderStatus: order.status,
            customerName: order.customerName,
            customerSurname: order.customerSurname,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            customerAddress: order.customerAddress,
            paymentMethod: order.paymentMethod,
            orderTotalPrice: order.totalPrice,
            productName: item.name,
            productId: item.productId,
            unitPrice: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          });
        });
      }
    });

    return await this.excelExportService.generateOrdersExcel(rows);
  }
}
