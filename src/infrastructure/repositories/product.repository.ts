import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  IProductRepository,
  PaginationOptions,
  PaginatedResult,
} from "@domain/repositories/product.repository.interface";
import { Product } from "@domain/entities/product.entity";
import { ProductTypeormEntity } from "../database/entities/product.typeorm-entity";
import { ProductMapper } from "../database/mappers/product.mapper";

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductTypeormEntity)
    private readonly repository: Repository<ProductTypeormEntity>
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find({
      order: { priority: "DESC", createdAt: "DESC" },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findAllPaginated(
    options: PaginationOptions
  ): Promise<PaginatedResult<Product>> {
    const [entities, total] = await this.repository.findAndCount({
      order: { priority: "DESC", createdAt: "DESC" },
      skip: options.skip,
      take: options.limit,
    });

    const data = entities.map(ProductMapper.toDomain);
    return { data, total };
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findFeatured(): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { isFeatured: true },
      order: { priority: "DESC", createdAt: "DESC" },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findBestSellers(): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { isBestSeller: true, disabled: false },
      order: { priority: "DESC", createdAt: "DESC" },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findBestSelect(): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { isBestSelect: true },
      order: { priority: "DESC", createdAt: "DESC" },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { categoryId },
      order: { priority: "DESC", createdAt: "DESC" },
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findByCategoryIdPaginated(
    categoryId: string,
    options: PaginationOptions,
    subcategoryId?: string,
    search?: string
  ): Promise<PaginatedResult<Product>> {
    const queryBuilder = this.repository
      .createQueryBuilder("product")
      .where("product.categoryId = :categoryId", { categoryId })
      .andWhere("product.disabled = :disabled", { disabled: false });

    if (subcategoryId) {
      queryBuilder.andWhere("product.subcategoryId = :subcategoryId", {
        subcategoryId,
      });
    }

    if (search) {
      queryBuilder.andWhere("LOWER(product.title) LIKE LOWER(:search)", {
        search: `%${search}%`,
      });
    }

    const [entities, total] = await queryBuilder
      .orderBy("product.priority", "DESC")
      .addOrderBy("product.createdAt", "DESC")
      .skip(options.skip)
      .take(options.limit)
      .getManyAndCount();

    const data = entities.map(ProductMapper.toDomain);
    return { data, total };
  }

  async findRandomByCategoryId(
    categoryId: string,
    limit: number,
    excludeProductId?: string
  ): Promise<Product[]> {
    const queryBuilder = this.repository
      .createQueryBuilder("product")
      .where("product.categoryId = :categoryId", { categoryId })
      .andWhere("product.disabled = :disabled", { disabled: false });

    if (excludeProductId) {
      queryBuilder.andWhere("product.id != :excludeProductId", {
        excludeProductId,
      });
    }

    const entities = await queryBuilder
      .orderBy("RANDOM()")
      .take(limit)
      .getMany();

    return entities.map(ProductMapper.toDomain);
  }

  async create(product: Product): Promise<Product> {
    const entity = ProductMapper.toTypeorm(product);
    const saved = await this.repository.save(entity);
    return ProductMapper.toDomain(saved);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const entity = ProductMapper.toTypeormPartial(product);
    await this.repository.update(id, entity);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error("Product not found after update");
    }
    return ProductMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async save(product: Product): Promise<Product> {
    const entity = ProductMapper.toTypeorm(product);
    const saved = await this.repository.save(entity);
    return ProductMapper.toDomain(saved);
  }
}
