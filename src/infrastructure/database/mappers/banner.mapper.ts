import { Banner } from '@domain/entities/banner.entity';
import { BannerTypeormEntity } from '../entities/banner.typeorm-entity';

export class BannerMapper {
  static toDomain(entity: BannerTypeormEntity): Banner {
    return new Banner(
      entity.id,
      entity.image,
      entity.url,
      entity.text,
      entity.textAm,
      entity.textRu,
      entity.isActive,
      entity.priority,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toTypeorm(domain: Banner): BannerTypeormEntity {
    const entity = new BannerTypeormEntity();
    entity.id = domain.id;
    entity.image = domain.image;
    entity.url = domain.url;
    entity.text = domain.text;
    entity.textAm = domain.textAm;
    entity.textRu = domain.textRu;
    entity.isActive = domain.isActive;
    entity.priority = domain.priority;
    return entity;
  }

  static toTypeormPartial(domain: Partial<Banner>): Partial<BannerTypeormEntity> {
    const entity: Partial<BannerTypeormEntity> = {};
    if (domain.image !== undefined) entity.image = domain.image;
    if (domain.url !== undefined) entity.url = domain.url;
    if (domain.text !== undefined) entity.text = domain.text;
    if (domain.textAm !== undefined) entity.textAm = domain.textAm;
    if (domain.textRu !== undefined) entity.textRu = domain.textRu;
    if (domain.isActive !== undefined) entity.isActive = domain.isActive;
    if (domain.priority !== undefined) entity.priority = domain.priority;
    return entity;
  }
}
