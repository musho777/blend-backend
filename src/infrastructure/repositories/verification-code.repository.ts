import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IVerificationCodeRepository } from '@domain/repositories/verification-code.repository.interface';
import { VerificationCode } from '@domain/entities/verification-code.entity';
import { VerificationCodeTypeormEntity } from '../database/entities/verification-code.typeorm-entity';
import { VerificationCodeMapper } from '../database/mappers/verification-code.mapper';

@Injectable()
export class VerificationCodeRepository implements IVerificationCodeRepository {
  constructor(
    @InjectRepository(VerificationCodeTypeormEntity)
    private readonly repository: Repository<VerificationCodeTypeormEntity>,
  ) {}

  async create(code: VerificationCode): Promise<VerificationCode> {
    const entity = VerificationCodeMapper.toTypeorm(code);
    const saved = await this.repository.save(entity);
    return VerificationCodeMapper.toDomain(saved);
  }

  async findByUserId(userId: string): Promise<VerificationCode | null> {
    const entity = await this.repository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
    return entity ? VerificationCodeMapper.toDomain(entity) : null;
  }

  async findByUserIdAndCode(userId: string, code: string): Promise<VerificationCode | null> {
    const entity = await this.repository.findOne({
      where: { userId, code }
    });
    return entity ? VerificationCodeMapper.toDomain(entity) : null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}
