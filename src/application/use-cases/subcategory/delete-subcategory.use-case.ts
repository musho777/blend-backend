import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISubcategoryRepository, SUBCATEGORY_REPOSITORY } from '@domain/repositories/subcategory.repository.interface';

@Injectable()
export class DeleteSubcategoryUseCase {
  constructor(
    @Inject(SUBCATEGORY_REPOSITORY)
    private readonly subcategoryRepository: ISubcategoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingSubcategory = await this.subcategoryRepository.findById(id);
    if (!existingSubcategory) {
      throw new NotFoundException(`Subcategory with id ${id} not found`);
    }

    await this.subcategoryRepository.delete(id);
  }
}
