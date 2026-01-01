import { VerificationCode } from '@domain/entities/verification-code.entity';
import { VerificationCodeTypeormEntity } from '../entities/verification-code.typeorm-entity';

export class VerificationCodeMapper {
  static toDomain(entity: VerificationCodeTypeormEntity): VerificationCode {
    return new VerificationCode(
      entity.id,
      entity.userId,
      entity.code,
      entity.expiresAt,
      entity.createdAt,
    );
  }

  static toTypeorm(domain: VerificationCode): VerificationCodeTypeormEntity {
    const entity = new VerificationCodeTypeormEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.code = domain.code;
    entity.expiresAt = domain.expiresAt;
    return entity;
  }
}
