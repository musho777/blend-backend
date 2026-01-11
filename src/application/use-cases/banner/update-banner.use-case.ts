import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  IBannerRepository,
  BANNER_REPOSITORY,
} from "@domain/repositories/banner.repository.interface";
import { Banner } from "@domain/entities/banner.entity";
import { UpdateBannerDto } from "@presentation/dtos/banner/update-banner.dto";

@Injectable()
export class UpdateBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository
  ) {}

  async execute(id: string, dto: UpdateBannerDto): Promise<Banner> {
    const existingBanner = await this.bannerRepository.findById(id);
    if (!existingBanner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    // Note: Old image deletion from GCS is handled in the controller layer
    const updatedBanner = new Banner(
      existingBanner.id,
      dto.image !== undefined ? dto.image : existingBanner.image,
      dto.url !== undefined ? dto.url : existingBanner.url,
      dto.text !== undefined ? dto.text : existingBanner.text,
      dto.textAm !== undefined ? dto.textAm : existingBanner.textAm,
      dto.textRu !== undefined ? dto.textRu : existingBanner.textRu,
      dto.isActive !== undefined ? dto.isActive : existingBanner.isActive,
      dto.priority !== undefined ? dto.priority : existingBanner.priority,
      existingBanner.createdAt,
      existingBanner.updatedAt
    );

    return await this.bannerRepository.update(id, updatedBanner);
  }
}
