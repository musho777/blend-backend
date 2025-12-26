import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBannerRepository } from '@domain/repositories/banner.repository.interface';
import { Banner } from '@domain/entities/banner.entity';
import { BannerTypeormEntity } from '../database/entities/banner.typeorm-entity';
import { BannerMapper } from '../database/mappers/banner.mapper';

@Injectable()
export class BannerRepository implements IBannerRepository {
  constructor(
    @InjectRepository(BannerTypeormEntity)
    private readonly repository: Repository<BannerTypeormEntity>,
  ) {}

  async findAll(): Promise<Banner[]> {
    const entities = await this.repository.find({
      order: { priority: 'ASC' },
    });
    return entities.map(BannerMapper.toDomain);
  }

  async findById(id: string): Promise<Banner | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? BannerMapper.toDomain(entity) : null;
  }

  async findActive(): Promise<Banner[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { priority: 'ASC' },
    });
    return entities.map(BannerMapper.toDomain);
  }

  async create(banner: Banner): Promise<Banner> {
    const entity = BannerMapper.toTypeorm(banner);
    const saved = await this.repository.save(entity);
    return BannerMapper.toDomain(saved);
  }

  async update(id: string, banner: Banner): Promise<Banner> {
    const entity = BannerMapper.toTypeormPartial(banner);
    await this.repository.update(id, entity);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Banner not found after update');
    }
    return BannerMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
