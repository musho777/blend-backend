export enum OrderStatus {
  PENDING = "pending",
  REJECTED = "rejected",
  SUCCESS = "success",
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = "cash_on_delivery",
  CARD = "card",
  ONLINE = "online",
}
export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: number,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number,
    public readonly name: string
  ) {}

  get subtotal(): number {
    return this.price * this.quantity;
  }
}

export class Order {
  constructor(
    public readonly id: number,
    public readonly customerName: string,
    public readonly customerSurname: string,
    public readonly customerAddress: string,
    public readonly customerPhone: string,
    public readonly paymentMethod: PaymentMethod,
    public readonly totalPrice: number,
    public readonly status: OrderStatus,
    public readonly items: OrderItem[],
    public readonly userId?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static calculateTotalPrice(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.subtotal, 0);
  }
}
