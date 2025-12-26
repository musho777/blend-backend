import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  IBannerRepository,
  BANNER_REPOSITORY,
} from "@domain/repositories/banner.repository.interface";
import { Banner } from "@domain/entities/banner.entity";
import { UpdateBannerDto } from "@presentation/dtos/banner/update-banner.dto";
import * as fs from "fs";
import * as path from "path";

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

    // Delete old image if a new image is provided
    if (
      dto.image &&
      existingBanner.image &&
      dto.image !== existingBanner.image
    ) {
      try {
        const filename = existingBanner.image.replace("/uploads/banners/", "");
        const filePath = path.join(process.cwd(), filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(
          `Failed to delete old banner image file: ${existingBanner.image}`,
          error
        );
      }
    }

    const updatedBanner = new Banner(
      existingBanner.id,
      dto.image !== undefined ? dto.image : existingBanner.image,
      dto.url !== undefined ? dto.url : existingBanner.url,
      dto.text !== undefined ? dto.text : existingBanner.text,
      dto.isActive !== undefined ? dto.isActive : existingBanner.isActive,
      dto.priority !== undefined ? dto.priority : existingBanner.priority,
      existingBanner.createdAt,
      existingBanner.updatedAt
    );

    return await this.bannerRepository.update(id, updatedBanner);
  }
}
