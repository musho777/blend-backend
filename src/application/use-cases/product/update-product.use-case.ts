import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from "@domain/repositories/product.repository.interface";
import {
  ISubcategoryRepository,
  SUBCATEGORY_REPOSITORY,
} from "@domain/repositories/subcategory.repository.interface";
import { Product } from "@domain/entities/product.entity";
import * as fs from "fs";
import * as path from "path";

export interface UpdateProductDto {
  title?: string;
  titleAm?: string;
  titleRu?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  subcategoryId?: string;
  description?: string;
  descriptionAm?: string;
  descriptionRu?: string;
  imageUrls?: string[];
  imagesToRemove?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isBestSelect?: boolean;
  priority?: number;
  disabled?: boolean;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(SUBCATEGORY_REPOSITORY)
    private readonly subcategoryRepository: ISubcategoryRepository
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Validate subcategory belongs to category if provided
    if (dto.subcategoryId !== undefined) {
      if (dto.subcategoryId) {
        const subcategory = await this.subcategoryRepository.findById(dto.subcategoryId);
        if (!subcategory) {
          throw new BadRequestException(`Subcategory with ID ${dto.subcategoryId} not found`);
        }

        // Check against the new categoryId if provided, otherwise use existing
        const targetCategoryId = dto.categoryId || existingProduct.categoryId;
        if (subcategory.categoryId !== targetCategoryId) {
          throw new BadRequestException(
            `Subcategory ${dto.subcategoryId} does not belong to category ${targetCategoryId}`
          );
        }
      }
      // If dto.subcategoryId is explicitly null or empty string, allow it (clearing subcategory)
    }

    let finalImageUrls = existingProduct.imageUrls || [];

    if (dto.imagesToRemove && dto.imagesToRemove.length > 0) {
      for (const imageUrl of dto.imagesToRemove) {
        try {
          const filename = imageUrl.replace("/uploads/products/", "");
          const filePath = path.join(process.cwd(), filename);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          finalImageUrls = finalImageUrls.filter((url) => url !== imageUrl);
        } catch (error) {
          console.error(`Failed to delete image file: ${imageUrl}`, error);
        }
      }
    }

    if (dto.imageUrls !== undefined) {
      finalImageUrls = [...finalImageUrls, ...dto.imageUrls];
    }

    const updateData = { ...dto };
    updateData.imageUrls = finalImageUrls;
    delete updateData.imagesToRemove;

    return await this.productRepository.update(id, updateData);
  }
}
