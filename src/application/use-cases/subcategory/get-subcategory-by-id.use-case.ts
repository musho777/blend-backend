import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISubcategoryRepository, SUBCATEGORY_REPOSITORY } from '@domain/repositories/subcategory.repository.interface';
import { Subcategory } from '@domain/entities/subcategory.entity';

@Injectable()
export class GetSubcategoryByIdUseCase {
  constructor(
    @Inject(SUBCATEGORY_REPOSITORY)
    private readonly subcategoryRepository: ISubcategoryRepository,
  ) {}

  async execute(id: string): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findById(id);
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with id ${id} not found`);
    }
    return subcategory;
  }
}
