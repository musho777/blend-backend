import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CreateProductDto } from "../dtos/product/create-product.dto";
import { UpdateProductDto } from "../dtos/product/update-product.dto";
import { ProductResponseDto } from "../dtos/product/product-response.dto";
import { CreateProductUseCase } from "@application/use-cases/product/create-product.use-case";
import { UpdateProductUseCase } from "@application/use-cases/product/update-product.use-case";
import { DeleteProductUseCase } from "@application/use-cases/product/delete-product.use-case";
import { GetProductsUseCase } from "@application/use-cases/product/get-products.use-case";
import { GetProductByIdUseCase } from "@application/use-cases/product/get-product-by-id.use-case";
import { FileUploadValidationPipe } from "@common/pipes/file-upload-validation.pipe";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/products";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new BadRequestException("Only image files are allowed"), false);
  }
};

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
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  @ApiOperation({ summary: "Create new product" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Product data with optional images (up to 10 files)",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "iPhone 15 Pro" },
        price: { type: "number", example: 999.99 },
        stock: { type: "number", example: 50 },
        categoryId: {
          type: "string",
          example: "123e4567-e89b-12d3-a456-426614174000",
        },
        isFeatured: { type: "boolean", example: true },
        isBestSeller: { type: "boolean", example: false },
        isBestSelect: { type: "boolean", example: false },
        priority: { type: "number", example: 10 },
        images: {
          type: "array",
          items: { type: "string", format: "binary" },
          description: "Product image files (max 10)",
          maxItems: 10,
        },
      },
      required: ["title", "price", "stock", "categoryId"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Product created",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async create(
    @Body(FileUploadValidationPipe) createProductDto: CreateProductDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<ProductResponseDto> {
    if (files && files.length > 0) {
      createProductDto.imageUrls = files.map(
        (file) => `/uploads/products/${file.filename}`
      );
    }

    const product = await this.createProductUseCase.execute(createProductDto);
    return ProductResponseDto.fromDomain(product);
  }

  @Put(":id")
  @UseInterceptors(
    FilesInterceptor("images", 10, {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  @ApiOperation({ summary: "Update product" })
  @ApiParam({ name: "id", description: "Product UUID" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Product data with optional images (up to 10 files)",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "iPhone 15 Pro Max" },
        price: { type: "number", example: 1099.99 },
        stock: { type: "number", example: 30 },
        categoryId: {
          type: "string",
          example: "123e4567-e89b-12d3-a456-426614174000",
        },
        isFeatured: { type: "boolean", example: true },
        isBestSeller: { type: "boolean", example: false },
        isBestSelect: { type: "boolean", example: false },
        priority: { type: "number", example: 20 },
        images: {
          type: "array",
          items: { type: "string", format: "binary" },
          description: "Product image files (max 10)",
          maxItems: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Product updated",
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  async update(
    @Param("id") id: string,
    @Body(FileUploadValidationPipe) updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ): Promise<ProductResponseDto> {
    if (files && files.length > 0) {
      updateProductDto.imageUrls = files.map(
        (file) => `/uploads/products/${file.filename}`
      );
    }

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
