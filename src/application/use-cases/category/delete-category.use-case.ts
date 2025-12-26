import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '@domain/repositories/category.repository.interface';
import { IProductRepository, PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    // Check if category has any products
    const products = await this.productRepository.findByCategoryId(id);
    if (products.length > 0) {
      throw new BadRequestException(
        `Cannot delete category "${existingCategory.title}" because it has ${products.length} product(s) associated with it. Please remove or reassign the products first.`
      );
    }

    await this.categoryRepository.delete(id);
  }
}
