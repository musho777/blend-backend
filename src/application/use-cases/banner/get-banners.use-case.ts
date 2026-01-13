import { Inject, Injectable } from '@nestjs/common';
import { IBannerRepository, BANNER_REPOSITORY } from '@domain/repositories/banner.repository.interface';
import { Banner } from '@domain/entities/banner.entity';

@Injectable()
export class GetBannersUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
  ) {}

  async execute(activeOnly?: boolean): Promise<Banner[]> {
    if (activeOnly === true) {
      return await this.bannerRepository.findActive();
    }
    return await this.bannerRepository.findAll();
  }
}
