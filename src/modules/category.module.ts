import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryTypeormEntity } from '@infrastructure/database/entities/category.typeorm-entity';
import { CategoryRepository } from '@infrastructure/repositories/category.repository';
import { CATEGORY_REPOSITORY } from '@domain/repositories/category.repository.interface';
import { CategoryController } from '@presentation/controllers/category.controller';
import { CreateCategoryUseCase } from '@application/use-cases/category/create-category.use-case';
import { UpdateCategoryUseCase } from '@application/use-cases/category/update-category.use-case';
import { DeleteCategoryUseCase } from '@application/use-cases/category/delete-category.use-case';
import { GetCategoriesUseCase } from '@application/use-cases/category/get-categories.use-case';
import { GetCategoryByIdUseCase } from '@application/use-cases/category/get-category-by-id.use-case';
import { ImageOptimizationService } from '@common/services/image-optimization.service';
import { ProductModule } from './product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryTypeormEntity]),
    ProductModule,
  ],
  controllers: [CategoryController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    GetCategoriesUseCase,
    GetCategoryByIdUseCase,
    ImageOptimizationService,
  ],
  exports: [CATEGORY_REPOSITORY],
})
export class CategoryModule {}
