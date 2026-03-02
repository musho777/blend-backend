import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

export interface ExcelOrderRow {
  orderId: number;
  orderDate: Date;
  orderStatus: string;
  customerName: string;
  customerSurname: string;
  customerEmail: string | null;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  orderTotalPrice: number;
  productName: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

@Injectable()
export class ExcelExportService {
  async generateOrdersExcel(rows: ExcelOrderRow[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders Export');

    worksheet.columns = [
      { header: 'Order ID', key: 'orderId', width: 10 },
      { header: 'Order Date', key: 'orderDate', width: 18 },
      { header: 'Status', key: 'orderStatus', width: 12 },
      { header: 'Customer Name', key: 'customerName', width: 18 },
      { header: 'Customer Surname', key: 'customerSurname', width: 18 },
      { header: 'Customer Email', key: 'customerEmail', width: 28 },
      { header: 'Customer Phone', key: 'customerPhone', width: 16 },
      { header: 'Customer Address', key: 'customerAddress', width: 35 },
      { header: 'Payment Method', key: 'paymentMethod', width: 18 },
      { header: 'Order Total', key: 'orderTotalPrice', width: 14 },
      { header: 'Product Name', key: 'productName', width: 28 },
      { header: 'Product ID', key: 'productId', width: 38 },
      { header: 'Unit Price', key: 'unitPrice', width: 14 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Subtotal', key: 'subtotal', width: 14 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 20;

    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    worksheet.getColumn('orderTotalPrice').numFmt = '$#,##0.00';
    worksheet.getColumn('unitPrice').numFmt = '$#,##0.00';
    worksheet.getColumn('subtotal').numFmt = '$#,##0.00';
    worksheet.getColumn('orderDate').numFmt = 'yyyy-mm-dd hh:mm:ss';

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
