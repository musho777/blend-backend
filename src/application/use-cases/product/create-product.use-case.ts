import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from "@domain/repositories/product.repository.interface";
import {
  ISubcategoryRepository,
  SUBCATEGORY_REPOSITORY,
} from "@domain/repositories/subcategory.repository.interface";
import { Product } from "@domain/entities/product.entity";
import { v4 as uuidv4 } from "uuid";
import { CreateProductDto } from "@presentation/dtos/product/create-product.dto";

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(SUBCATEGORY_REPOSITORY)
    private readonly subcategoryRepository: ISubcategoryRepository
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    // Validate subcategory belongs to category if provided
    if (dto.subcategoryId) {
      const subcategory = await this.subcategoryRepository.findById(dto.subcategoryId);
      if (!subcategory) {
        throw new BadRequestException(`Subcategory with ID ${dto.subcategoryId} not found`);
      }
      if (subcategory.categoryId !== dto.categoryId) {
        throw new BadRequestException(
          `Subcategory ${dto.subcategoryId} does not belong to category ${dto.categoryId}`
        );
      }
    }

    const product = new Product(
      uuidv4(),
      dto.title,
      dto.price,
      dto.stock,
      dto.categoryId,
      dto.subcategoryId || null,
      dto.description || '',
      dto.imageUrls || [],
      dto.isFeatured || false,
      dto.isBestSeller || false,
      dto.isBestSelect || false,
      dto.priority || 0
    );

    return await this.productRepository.create(product);
  }
}
