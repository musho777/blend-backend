import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '@domain/repositories/category.repository.interface';
import { Category } from '@domain/entities/category.entity';
import { CreateCategoryDto } from '@presentation/dtos/category/create-category.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug || Category.generateSlug(dto.title);

    const existingCategory = await this.categoryRepository.findBySlug(slug);
    if (existingCategory) {
      throw new ConflictException(`Category with slug ${slug} already exists`);
    }

    const category = new Category(
      uuidv4(),
      dto.title,
      dto.titleAm || '',
      dto.titleRu || '',
      slug,
      dto.image || '',
    );

    return await this.categoryRepository.create(category);
  }
}
