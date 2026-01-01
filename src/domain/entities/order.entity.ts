export class Order {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly totalPrice: number,
    public readonly userId?: string,
    public readonly guestEmail?: string,
    public readonly createdAt?: Date,
  ) {}

  static calculateTotalPrice(unitPrice: number, quantity: number): number {
    return unitPrice * quantity;
  }
}
