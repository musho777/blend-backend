import { Admin } from '@domain/entities/admin.entity';
import { AdminTypeormEntity } from '../entities/admin.typeorm-entity';

export class AdminMapper {
  static toDomain(entity: AdminTypeormEntity): Admin {
    return new Admin(
      entity.id,
      entity.email,
      entity.passwordHash,
      entity.role,
      entity.createdAt,
    );
  }

  static toTypeorm(domain: Admin): AdminTypeormEntity {
    const entity = new AdminTypeormEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.passwordHash = domain.passwordHash;
    entity.role = domain.role;
    return entity;
  }
}
