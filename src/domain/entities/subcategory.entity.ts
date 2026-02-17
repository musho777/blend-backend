export class Subcategory {
  id: string;
  title: string;
  titleAm: string;
  titleRu: string;
  categoryId: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: string,
    titleAm: string = '',
    titleRu: string = '',
    categoryId: string,
    orderIndex: number = 0,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.titleAm = titleAm;
    this.titleRu = titleRu;
    this.categoryId = categoryId;
    this.orderIndex = orderIndex;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  updateTitle(title: string): void {
    this.title = title;
  }

  updateCategory(categoryId: string): void {
    this.categoryId = categoryId;
  }

  updateOrderIndex(orderIndex: number): void {
    this.orderIndex = orderIndex;
  }
}
