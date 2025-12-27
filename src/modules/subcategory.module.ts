import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryTypeormEntity } from '@infrastructure/database/entities/subcategory.typeorm-entity';
import { SubcategoryRepository } from '@infrastructure/repositories/subcategory.repository';
import { SUBCATEGORY_REPOSITORY } from '@domain/repositories/subcategory.repository.interface';
import { SubcategoryController } from '@presentation/controllers/subcategory.controller';
import { CreateSubcategoryUseCase } from '@application/use-cases/subcategory/create-subcategory.use-case';
import { UpdateSubcategoryUseCase } from '@application/use-cases/subcategory/update-subcategory.use-case';
import { DeleteSubcategoryUseCase } from '@application/use-cases/subcategory/delete-subcategory.use-case';
import { GetSubcategoriesUseCase } from '@application/use-cases/subcategory/get-subcategories.use-case';
import { GetSubcategoryByIdUseCase } from '@application/use-cases/subcategory/get-subcategory-by-id.use-case';
import { GetSubcategoriesByCategoryIdUseCase } from '@application/use-cases/subcategory/get-subcategories-by-category-id.use-case';
import { CategoryModule } from './category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubcategoryTypeormEntity]),
    forwardRef(() => CategoryModule),
  ],
  controllers: [SubcategoryController],
  providers: [
    {
      provide: SUBCATEGORY_REPOSITORY,
      useClass: SubcategoryRepository,
    },
    CreateSubcategoryUseCase,
    UpdateSubcategoryUseCase,
    DeleteSubcategoryUseCase,
    GetSubcategoriesUseCase,
    GetSubcategoryByIdUseCase,
    GetSubcategoriesByCategoryIdUseCase,
  ],
  exports: [SUBCATEGORY_REPOSITORY],
})
export class SubcategoryModule {}
