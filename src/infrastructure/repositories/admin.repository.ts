import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAdminRepository } from '@domain/repositories/admin.repository.interface';
import { Admin } from '@domain/entities/admin.entity';
import { AdminTypeormEntity } from '../database/entities/admin.typeorm-entity';
import { AdminMapper } from '../database/mappers/admin.mapper';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @InjectRepository(AdminTypeormEntity)
    private readonly repository: Repository<AdminTypeormEntity>,
  ) {}

  async findByEmail(email: string): Promise<Admin | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? AdminMapper.toDomain(entity) : null;
  }

  async findById(id: string): Promise<Admin | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? AdminMapper.toDomain(entity) : null;
  }

  async create(admin: Admin): Promise<Admin> {
    const entity = AdminMapper.toTypeorm(admin);
    const saved = await this.repository.save(entity);
    return AdminMapper.toDomain(saved);
  }
}
