import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from "@domain/repositories/category.repository.interface";
import { Category } from "@domain/entities/category.entity";
import { UpdateCategoryDto } from "@presentation/dtos/category/update-category.dto";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async execute(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    // Delete old image if a new image is provided
    if (
      dto.image &&
      existingCategory.image &&
      dto.image !== existingCategory.image
    ) {
      try {
        const filename = existingCategory.image.replace(
          "/uploads/categories/",
          ""
        );
        const filePath = path.join(process.cwd(), filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(
          `Failed to delete old category image file: ${existingCategory.image}`,
          error
        );
      }
    }

    return await this.categoryRepository.update(id, dto);
  }
}
