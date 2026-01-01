import { User } from '@domain/entities/user.entity';
import { UserTypeormEntity } from '../entities/user.typeorm-entity';

export class UserMapper {
  static toDomain(entity: UserTypeormEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.passwordHash,
      entity.firstName,
      entity.lastName,
      entity.phone,
      entity.isVerified,
      entity.googleId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toTypeorm(domain: User): UserTypeormEntity {
    const entity = new UserTypeormEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.passwordHash = domain.passwordHash;
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    entity.phone = domain.phone;
    entity.isVerified = domain.isVerified;
    entity.googleId = domain.googleId;
    return entity;
  }
}
