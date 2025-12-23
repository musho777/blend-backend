import { Inject, Injectable } from '@nestjs/common';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '@domain/repositories/category.repository.interface';
import { Category } from '@domain/entities/category.entity';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
}
