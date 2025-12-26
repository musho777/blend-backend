import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  ICategoryRepository,
  CATEGORY_REPOSITORY,
} from "@domain/repositories/category.repository.interface";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from "@domain/repositories/product.repository.interface";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository
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

    // Delete category image from file system if it exists
    if (existingCategory.image) {
      console.log(existingCategory.image);
      try {
        const filename = existingCategory.image.replace(
          "/uploads/categories/",
          ""
        );
        const filePath = path.join(process.cwd(), filename);
        if (fs.existsSync(filePath)) {
          console.log("fdjhgdkjfhgdjkf");
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(
          `Failed to delete category image file: ${existingCategory.image}`,
          error
        );
      }
    }

    await this.categoryRepository.delete(id);
  }
}
