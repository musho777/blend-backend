import { Inject, Injectable } from '@nestjs/common';
import { ISubcategoryRepository, SUBCATEGORY_REPOSITORY } from '@domain/repositories/subcategory.repository.interface';
import { Subcategory } from '@domain/entities/subcategory.entity';

@Injectable()
export class GetSubcategoriesUseCase {
  constructor(
    @Inject(SUBCATEGORY_REPOSITORY)
    private readonly subcategoryRepository: ISubcategoryRepository,
  ) {}

  async execute(): Promise<Subcategory[]> {
    return await this.subcategoryRepository.findAll();
  }
}
