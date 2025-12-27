import { Subcategory } from '@domain/entities/subcategory.entity';
import { SubcategoryTypeormEntity } from '../entities/subcategory.typeorm-entity';

export class SubcategoryMapper {
  static toDomain(entity: SubcategoryTypeormEntity): Subcategory {
    return new Subcategory(
      entity.id,
      entity.title,
      entity.categoryId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toTypeorm(domain: Subcategory): SubcategoryTypeormEntity {
    const entity = new SubcategoryTypeormEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.categoryId = domain.categoryId;
    return entity;
  }

  static toTypeormPartial(domain: Partial<Subcategory>): Partial<SubcategoryTypeormEntity> {
    const entity: Partial<SubcategoryTypeormEntity> = {};
    if (domain.title !== undefined) entity.title = domain.title;
    if (domain.categoryId !== undefined) entity.categoryId = domain.categoryId;
    return entity;
  }
}
