import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  IBannerRepository,
  BANNER_REPOSITORY,
} from "@domain/repositories/banner.repository.interface";
import { GoogleCloudStorageService } from "@common/services/google-cloud-storage.service";

@Injectable()
export class DeleteBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
    private readonly gcsService: GoogleCloudStorageService
  ) {}

  async execute(id: string): Promise<void> {
    const existingBanner = await this.bannerRepository.findById(id);
    if (!existingBanner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    // Delete banner image from Google Cloud Storage if it exists
    if (existingBanner.image) {
      try {
        await this.gcsService.deleteFile(existingBanner.image);
      } catch (error) {
        console.error(
          `Failed to delete banner image from GCS: ${existingBanner.image}`,
          error
        );
      }
    }

    await this.bannerRepository.delete(id);
  }
}
