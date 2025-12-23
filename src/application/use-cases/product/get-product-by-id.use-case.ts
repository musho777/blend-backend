import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from "@domain/repositories/product.repository.interface";
import { Product } from "@domain/entities/product.entity";

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository
  ) {}

  async execute(id: string): Promise<Product> {
    console.log(id);
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
}
