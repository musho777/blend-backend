import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  IBannerRepository,
  BANNER_REPOSITORY,
} from "@domain/repositories/banner.repository.interface";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class DeleteBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository
  ) {}

  async execute(id: string): Promise<void> {
    const existingBanner = await this.bannerRepository.findById(id);
    if (!existingBanner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    // Delete banner image from file system if it exists
    if (existingBanner.image) {
      try {
        const filename = existingBanner.image.replace("/uploads/banners/", "");
        const filePath = path.join(process.cwd(), filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(
          `Failed to delete banner image file: ${existingBanner.image}`,
          error
        );
      }
    }

    await this.bannerRepository.delete(id);
  }
}
