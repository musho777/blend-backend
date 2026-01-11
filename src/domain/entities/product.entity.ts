export class Product {
  constructor(
    public readonly id: string,
    public title: string,
    public titleAm: string = '',
    public titleRu: string = '',
    public price: number,
    public stock: number,
    public categoryId: string,
    public subcategoryId: string | null = null,
    public description: string = '',
    public descriptionAm: string = '',
    public descriptionRu: string = '',
    public imageUrls: string[] = [],
    public isFeatured: boolean = false,
    public isBestSeller: boolean = false,
    public isBestSelect: boolean = false,
    public priority: number = 0,
    public disabled: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  updateStock(quantity: number): void {
    if (this.stock + quantity < 0) {
      throw new Error("Insufficient stock");
    }
    this.stock += quantity;
  }

  reduceStock(quantity: number): void {
    if (quantity > this.stock) {
      throw new Error(
        `Cannot reduce stock by ${quantity}. Only ${this.stock} available.`
      );
    }
    this.stock -= quantity;
  }

  increaseStock(quantity: number): void {
    this.stock += quantity;
  }

  markAsFeatured(): void {
    this.isFeatured = true;
  }

  unmarkAsFeatured(): void {
    this.isFeatured = false;
  }

  markAsBestSeller(): void {
    this.isBestSeller = true;
  }

  unmarkAsBestSeller(): void {
    this.isBestSeller = false;
  }

  markAsBestSelect(): void {
    this.isBestSelect = true;
  }

  unmarkAsBestSelect(): void {
    this.isBestSelect = false;
  }

  updatePriority(priority: number): void {
    this.priority = priority;
  }

  disable(): void {
    this.disabled = true;
  }

  enable(): void {
    this.disabled = false;
  }
}
