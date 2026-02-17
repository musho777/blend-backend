export class Category {
  constructor(
    public readonly id: string,
    public title: string,
    public titleAm: string = '',
    public titleRu: string = '',
    public slug: string,
    public image: string,
    public orderIndex: number = 0,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  updateTitle(title: string): void {
    this.title = title;
  }

  updateSlug(slug: string): void {
    this.slug = slug;
  }

  updateImage(image: string): void {
    this.image = image;
  }

  updateOrderIndex(orderIndex: number): void {
    this.orderIndex = orderIndex;
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
