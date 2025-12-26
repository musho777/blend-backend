import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from "@domain/repositories/product.repository.interface";
import { Product } from "@domain/entities/product.entity";
import * as fs from "fs";
import * as path from "path";

export interface UpdateProductDto {
  title?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  imageUrls?: string[];
  imagesToRemove?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isBestSelect?: boolean;
  priority?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
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
