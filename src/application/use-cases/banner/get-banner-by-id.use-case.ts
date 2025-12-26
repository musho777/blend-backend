import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBannerRepository, BANNER_REPOSITORY } from '@domain/repositories/banner.repository.interface';
import { Banner } from '@domain/entities/banner.entity';

@Injectable()
export class GetBannerByIdUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
  ) {}

  async execute(id: string): Promise<Banner> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }
    return banner;
  }
}
