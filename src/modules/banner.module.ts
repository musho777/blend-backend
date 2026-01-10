import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerTypeormEntity } from '@infrastructure/database/entities/banner.typeorm-entity';
import { BannerRepository } from '@infrastructure/repositories/banner.repository';
import { BANNER_REPOSITORY } from '@domain/repositories/banner.repository.interface';
import { BannerController } from '@presentation/controllers/banner.controller';
import { CreateBannerUseCase } from '@application/use-cases/banner/create-banner.use-case';
import { UpdateBannerUseCase } from '@application/use-cases/banner/update-banner.use-case';
import { DeleteBannerUseCase } from '@application/use-cases/banner/delete-banner.use-case';
import { GetBannersUseCase } from '@application/use-cases/banner/get-banners.use-case';
import { GetBannerByIdUseCase } from '@application/use-cases/banner/get-banner-by-id.use-case';
import { GetActiveBannersUseCase } from '@application/use-cases/banner/get-active-banners.use-case';
import { ImageOptimizationService } from '@common/services/image-optimization.service';
import { GoogleCloudStorageService } from '@common/services/google-cloud-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([BannerTypeormEntity])],
  controllers: [BannerController],
  providers: [
    {
      provide: BANNER_REPOSITORY,
      useClass: BannerRepository,
    },
    CreateBannerUseCase,
    UpdateBannerUseCase,
    DeleteBannerUseCase,
    GetBannersUseCase,
    GetBannerByIdUseCase,
    GetActiveBannersUseCase,
    ImageOptimizationService,
    GoogleCloudStorageService,
  ],
  exports: [BANNER_REPOSITORY, GetActiveBannersUseCase],
})
export class BannerModule {}
