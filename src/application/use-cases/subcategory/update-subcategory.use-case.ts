import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISubcategoryRepository, SUBCATEGORY_REPOSITORY } from '@domain/repositories/subcategory.repository.interface';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '@domain/repositories/category.repository.interface';
import { Subcategory } from '@domain/entities/subcategory.entity';
import { UpdateSubcategoryDto } from '@presentation/dtos/subcategory/update-subcategory.dto';

@Injectable()
export class UpdateSubcategoryUseCase {
  constructor(
    @Inject(SUBCATEGORY_REPOSITORY)
    private readonly subcategoryRepository: ISubcategoryRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(id: string, dto: UpdateSubcategoryDto): Promise<Subcategory> {
    const existingSubcategory = await this.subcategoryRepository.findById(id);
    if (!existingSubcategory) {
      throw new NotFoundException(`Subcategory with id ${id} not found`);
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException(`Category with ID ${dto.categoryId} not found`);
      }
    }

    return await this.subcategoryRepository.update(id, dto);
  }
}
