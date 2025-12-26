import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeormEntity } from '@infrastructure/database/entities/product.typeorm-entity';
import { CategoryTypeormEntity } from '@infrastructure/database/entities/category.typeorm-entity';
import { ProductRepository } from '@infrastructure/repositories/product.repository';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import { CATEGORY_REPOSITORY } from '@domain/repositories/category.repository.interface';
import { HomeController } from '@presentation/controllers/home.controller';
import { GetFeaturedProductsUseCase } from '@application/use-cases/home/get-featured-products.use-case';
import { GetBestSellersUseCase } from '@application/use-cases/home/get-best-sellers.use-case';
import { GetBestSelectUseCase } from '@application/use-cases/home/get-best-select.use-case';
import { GetCategoriesUseCase } from '@application/use-cases/category/get-categories.use-case';
import { BannerModule } from './banner.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductTypeormEntity, CategoryTypeormEntity]),
    BannerModule,
  ],
  controllers: [HomeController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    GetFeaturedProductsUseCase,
    GetBestSellersUseCase,
    GetBestSelectUseCase,
    GetCategoriesUseCase,
  ],
})
export class HomeModule {}
