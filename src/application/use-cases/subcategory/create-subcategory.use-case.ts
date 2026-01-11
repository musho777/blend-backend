import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISubcategoryRepository, SUBCATEGORY_REPOSITORY } from '@domain/repositories/subcategory.repository.interface';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '@domain/repositories/category.repository.interface';
import { Subcategory } from '@domain/entities/subcategory.entity';
import { CreateSubcategoryDto } from '@presentation/dtos/subcategory/create-subcategory.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateSubcategoryUseCase {
  constructor(
    @Inject(SUBCATEGORY_REPOSITORY)
    private readonly subcategoryRepository: ISubcategoryRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateSubcategoryDto): Promise<Subcategory> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
    }

    const subcategory = new Subcategory(
      uuidv4(),
      dto.title,
      dto.titleAm || '',
      dto.titleRu || '',
      dto.categoryId,
      new Date(),
      new Date(),
    );

    return await this.subcategoryRepository.create(subcategory);
  }
}
