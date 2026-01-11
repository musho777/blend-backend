import { Product } from '@domain/entities/product.entity';
import { ProductTypeormEntity } from '../entities/product.typeorm-entity';

export class ProductMapper {
  static toDomain(entity: ProductTypeormEntity): Product {
    return new Product(
      entity.id,
      entity.title,
      entity.titleAm || '',
      entity.titleRu || '',
      Number(entity.price),
      entity.stock,
      entity.categoryId,
      entity.subcategoryId || null,
      entity.description || '',
      entity.descriptionAm || '',
      entity.descriptionRu || '',
      entity.imageUrls || [],
      entity.isFeatured,
      entity.isBestSeller,
      entity.isBestSelect,
      entity.priority,
      entity.disabled,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toTypeorm(domain: Product): ProductTypeormEntity {
    const entity = new ProductTypeormEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.titleAm = domain.titleAm;
    entity.titleRu = domain.titleRu;
    entity.price = domain.price;
    entity.stock = domain.stock;
    entity.categoryId = domain.categoryId;
    entity.subcategoryId = domain.subcategoryId;
    entity.description = domain.description;
    entity.descriptionAm = domain.descriptionAm;
    entity.descriptionRu = domain.descriptionRu;
    entity.imageUrls = domain.imageUrls;
    entity.isFeatured = domain.isFeatured;
    entity.isBestSeller = domain.isBestSeller;
    entity.isBestSelect = domain.isBestSelect;
    entity.priority = domain.priority;
    entity.disabled = domain.disabled;
    return entity;
  }

  static toTypeormPartial(domain: Partial<Product>): Partial<ProductTypeormEntity> {
    const entity: Partial<ProductTypeormEntity> = {};
    if (domain.title !== undefined) entity.title = domain.title;
    if (domain.titleAm !== undefined) entity.titleAm = domain.titleAm;
    if (domain.titleRu !== undefined) entity.titleRu = domain.titleRu;
    if (domain.price !== undefined) entity.price = domain.price;
    if (domain.stock !== undefined) entity.stock = domain.stock;
    if (domain.categoryId !== undefined) entity.categoryId = domain.categoryId;
    if (domain.subcategoryId !== undefined) entity.subcategoryId = domain.subcategoryId;
    if (domain.description !== undefined) entity.description = domain.description;
    if (domain.descriptionAm !== undefined) entity.descriptionAm = domain.descriptionAm;
    if (domain.descriptionRu !== undefined) entity.descriptionRu = domain.descriptionRu;
    if (domain.imageUrls !== undefined) entity.imageUrls = domain.imageUrls;
    if (domain.isFeatured !== undefined) entity.isFeatured = domain.isFeatured;
    if (domain.isBestSeller !== undefined) entity.isBestSeller = domain.isBestSeller;
    if (domain.isBestSelect !== undefined) entity.isBestSelect = domain.isBestSelect;
    if (domain.priority !== undefined) entity.priority = domain.priority;
    if (domain.disabled !== undefined) entity.disabled = domain.disabled;
    return entity;
  }
}
