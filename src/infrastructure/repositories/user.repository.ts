import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { UserTypeormEntity } from '../database/entities/user.typeorm-entity';
import { UserMapper } from '../database/mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly repository: Repository<UserTypeormEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(UserMapper.toDomain);
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { googleId } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async create(user: User): Promise<User> {
    const entity = UserMapper.toTypeorm(user);
    const saved = await this.repository.save(entity);
    return UserMapper.toDomain(saved);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, {
      ...userData,
      passwordHash: userData.passwordHash,
      isVerified: userData.isVerified,
    } as any);
    const updated = await this.repository.findOne({ where: { id } });
    return UserMapper.toDomain(updated);
  }
}
