import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CreateProductDto } from "../dtos/product/create-product.dto";
import { UpdateProductDto } from "../dtos/product/update-product.dto";
import { ProductResponseDto } from "../dtos/product/product-response.dto";
import { CreateProductUseCase } from "@application/use-cases/product/create-product.use-case";
import { UpdateProductUseCase } from "@application/use-cases/product/update-product.use-case";
import { DeleteProductUseCase } from "@application/use-cases/product/delete-product.use-case";
import { GetProductsUseCase } from "@application/use-cases/product/get-products.use-case";
import { GetProductByIdUseCase } from "@application/use-cases/product/get-product-by-id.use-case";

@ApiTags("Products")
@ApiBearerAuth("JWT-auth")
@Controller("products")
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({
    status: 200,
    description: "List of all products",
    type: [ProductResponseDto],
  })
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.getProductsUseCase.execute();
    return ProductResponseDto.fromDomainArray(products);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID" })
  @ApiParam({ name: "id", description: "Product UUID" })
  @ApiResponse({
    status: 200,
    description: "Product found",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid UUID" })
  @ApiResponse({ status: 404, description: "Product not found" })
  async findOne(@Param("id") id: string): Promise<ProductResponseDto> {
    const product = await this.getProductByIdUseCase.execute(id);
    return ProductResponseDto.fromDomain(product);
  }

  @Post()
  @ApiOperation({ summary: "Create new product" })
  @ApiResponse({
    status: 201,
    description: "Product created",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(createProductDto);
    return ProductResponseDto.fromDomain(product);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update product" })
  @ApiParam({ name: "id", description: "Product UUID" })
  @ApiResponse({
    status: 200,
    description: "Product updated",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute(
      id,
      updateProductDto
    );
    return ProductResponseDto.fromDomain(product);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product" })
  @ApiParam({ name: "id", description: "Product UUID" })
  @ApiResponse({ status: 200, description: "Product deleted" })
  @ApiResponse({ status: 404, description: "Product not found" })
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.deleteProductUseCase.execute(id);
    return { message: "Product deleted successfully" };
  }
}
