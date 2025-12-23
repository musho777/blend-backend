import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductResponseDto } from '../dtos/product/product-response.dto';
import { CategoryResponseDto } from '../dtos/category/category-response.dto';
import { GetFeaturedProductsUseCase } from '@application/use-cases/home/get-featured-products.use-case';
import { GetBestSellersUseCase } from '@application/use-cases/home/get-best-sellers.use-case';
import { GetBestSelectUseCase } from '@application/use-cases/home/get-best-select.use-case';
import { GetCategoriesUseCase } from '@application/use-cases/category/get-categories.use-case';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(
    private readonly getFeaturedProductsUseCase: GetFeaturedProductsUseCase,
    private readonly getBestSellersUseCase: GetBestSellersUseCase,
    private readonly getBestSelectUseCase: GetBestSelectUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
  ) {}

  @Get('slider')
  @ApiOperation({ summary: 'Get featured products for slider', description: 'Public endpoint - no authentication required' })
  @ApiResponse({ status: 200, description: 'List of featured products', type: [ProductResponseDto] })
  async getSlider(): Promise<ProductResponseDto[]> {
    const products = await this.getFeaturedProductsUseCase.execute();
    return ProductResponseDto.fromDomainArray(products);
  }

  @Get('best-seller')
  @ApiOperation({ summary: 'Get best seller products', description: 'Public endpoint - no authentication required' })
  @ApiResponse({ status: 200, description: 'List of best seller products', type: [ProductResponseDto] })
  async getBestSeller(): Promise<ProductResponseDto[]> {
    const products = await this.getBestSellersUseCase.execute();
    return ProductResponseDto.fromDomainArray(products);
  }

  @Get('best-select')
  @ApiOperation({ summary: 'Get best select products', description: 'Public endpoint - no authentication required' })
  @ApiResponse({ status: 200, description: 'List of best select products', type: [ProductResponseDto] })
  async getBestSelect(): Promise<ProductResponseDto[]> {
    const products = await this.getBestSelectUseCase.execute();
    return ProductResponseDto.fromDomainArray(products);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories', description: 'Public endpoint - no authentication required' })
  @ApiResponse({ status: 200, description: 'List of all categories', type: [CategoryResponseDto] })
  async getCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.getCategoriesUseCase.execute();
    return CategoryResponseDto.fromDomainArray(categories);
  }
}
