import { Inject, Injectable } from '@nestjs/common';
import { IBannerRepository, BANNER_REPOSITORY } from '@domain/repositories/banner.repository.interface';
import { Banner } from '@domain/entities/banner.entity';
import { CreateBannerDto } from '@presentation/dtos/banner/create-banner.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
  ) {}

  async execute(dto: CreateBannerDto): Promise<Banner> {
    const banner = new Banner(
      uuidv4(),
      dto.image || '',
      dto.url,
      dto.text || null,
      dto.textAm || '',
      dto.textRu || '',
      dto.isActive !== undefined ? dto.isActive : true,
      dto.priority !== undefined ? dto.priority : 1,
    );

    return await this.bannerRepository.create(banner);
  }
}
