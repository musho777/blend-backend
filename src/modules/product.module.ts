import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeormEntity } from '@infrastructure/database/entities/product.typeorm-entity';
import { ProductRepository } from '@infrastructure/repositories/product.repository';
import { PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import { ProductController } from '@presentation/controllers/product.controller';
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';
import { GetProductsUseCase } from '@application/use-cases/product/get-products.use-case';
import { GetProductByIdUseCase } from '@application/use-cases/product/get-product-by-id.use-case';
import { GetProductsByCategoryUseCase } from '@application/use-cases/product/get-products-by-category.use-case';
import { ImageOptimizationService } from '@common/services/image-optimization.service';
import { GoogleCloudStorageService } from '@common/services/google-cloud-storage.service';
import { SubcategoryModule } from './subcategory.module';
import { CategoryModule } from './category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductTypeormEntity]),
    forwardRef(() => SubcategoryModule),
    forwardRef(() => CategoryModule),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    GetProductsUseCase,
    GetProductByIdUseCase,
    GetProductsByCategoryUseCase,
    ImageOptimizationService,
    GoogleCloudStorageService,
  ],
  exports: [PRODUCT_REPOSITORY, GetProductsByCategoryUseCase],
})
export class ProductModule {}
