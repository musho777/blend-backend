import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (existingProduct.imageUrls && existingProduct.imageUrls.length > 0) {
      for (const imageUrl of existingProduct.imageUrls) {
        try {
          const filename = imageUrl.replace('/uploads/products/', '');
          const filePath = path.join(process.cwd(), 'uploads', 'products', filename);
          
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.error(`Failed to delete image file: ${imageUrl}`, error);
        }
      }
    }

    await this.productRepository.delete(id);
  }
}
