import { Inject, Injectable } from '@nestjs/common';
import { IBannerRepository, BANNER_REPOSITORY } from '@domain/repositories/banner.repository.interface';
import { Banner } from '@domain/entities/banner.entity';

@Injectable()
export class GetActiveBannersUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
  ) {}

  async execute(): Promise<Banner[]> {
    return await this.bannerRepository.findActive();
  }
}
