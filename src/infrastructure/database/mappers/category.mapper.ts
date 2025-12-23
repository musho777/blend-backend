import { Category } from '@domain/entities/category.entity';
import { CategoryTypeormEntity } from '../entities/category.typeorm-entity';

export class CategoryMapper {
  static toDomain(entity: CategoryTypeormEntity): Category {
    return new Category(
      entity.id,
      entity.title,
      entity.slug,
      entity.image,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toTypeorm(domain: Category): CategoryTypeormEntity {
    const entity = new CategoryTypeormEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.slug = domain.slug;
    entity.image = domain.image;
    return entity;
  }

  static toTypeormPartial(domain: Partial<Category>): Partial<CategoryTypeormEntity> {
    const entity: Partial<CategoryTypeormEntity> = {};
    if (domain.title !== undefined) entity.title = domain.title;
    if (domain.slug !== undefined) entity.slug = domain.slug;
    if (domain.image !== undefined) entity.image = domain.image;
    return entity;
  }
}
