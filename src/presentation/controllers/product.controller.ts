import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
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
  ApiQuery,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { ImageOptimizationService } from "@common/services/image-optimization.service";
import { CreateProductDto } from "../dtos/product/create-product.dto";
import { UpdateProductDto } from "../dtos/product/update-product.dto";
import { ProductResponseDto } from "../dtos/product/product-response.dto";
import {
  PaginationDto,
  PaginatedResponseDto,
} from "../dtos/common/pagination.dto";
import { CreateProductUseCase } from "@application/use-cases/product/create-product.use-case";
import { UpdateProductUseCase } from "@application/use-cases/product/update-product.use-case";
import { DeleteProductUseCase } from "@application/use-cases/product/delete-product.use-case";
import { GetProductsUseCase } from "@application/use-cases/product/get-products.use-case";
import { GetProductByIdUseCase } from "@application/use-cases/product/get-product-by-id.use-case";
import { FileUploadValidationPipe } from "@common/pipes/file-upload-validation.pipe";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/products/temp";
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
@Controller("products")
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly imageOptimizationService: ImageOptimizationService
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all products with optional pagination" })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number (starting from 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of products per page (max 100)",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "List of products with pagination metadata",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: { $ref: "#/components/schemas/ProductResponseDto" },
        },
        meta: {
          type: "object",
          properties: {
            page: { type: "number", example: 1 },
            limit: { type: "number", example: 10 },
            total: { type: "number", example: 100 },
            pages: { type: "number", example: 10 },
            hasNext: { type: "boolean", example: true },
            hasPrevious: { type: "boolean", example: false },
          },
        },
      },
    },
  })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = paginationDto.skip;
    const result = await this.getProductsUseCase.executePaginated({
      page,
      limit,
      skip,
    });

    const productDtos = ProductResponseDto.fromDomainArray(result.data);

    return PaginatedResponseDto.create(productDtos, result.total, page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get product by ID with suggestions" })
  @ApiParam({ name: "id", description: "Product UUID" })
  @ApiResponse({
    status: 200,
    description: "Product found with 10 random suggested products from the same category",
    schema: {
      type: "object",
      properties: {
        product: { $ref: "#/components/schemas/ProductResponseDto" },
        suggestions: {
          type: "array",
          items: { $ref: "#/components/schemas/ProductResponseDto" },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Invalid UUID" })
  @ApiResponse({ status: 404, description: "Product not found" })
  async findOne(@Param("id") id: string): Promise<{
    product: ProductResponseDto;
    suggestions: ProductResponseDto[];
  }> {
    const result = await this.getProductByIdUseCase.execute(id);
    return {
      product: ProductResponseDto.fromDomain(result.product),
      suggestions: ProductResponseDto.fromDomainArray(result.suggestions),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
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
      const tempPaths = files.map((file) => file.path);
      const optimizedPaths =
        await this.imageOptimizationService.optimizeMultipleImages(
          tempPaths,
          "./uploads/products",
          {
            preset: "large",
            quality: 80,
            convertToWebP: true,
            removeMetadata: true,
            preserveAspectRatio: true,
          }
        );

      createProductDto.imageUrls = optimizedPaths.map((filePath) =>
        filePath.replace("./uploads", "/uploads")
      );
    }

    const product = await this.createProductUseCase.execute(createProductDto);
    return ProductResponseDto.fromDomain(product);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
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
    description:
      "Product data with optional images (up to 10 files). New images will be added to existing ones.",
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
        imagesToRemove: {
          type: "array",
          items: { type: "string" },
          description: "Image URLs to remove from product",
          example: ["/uploads/products/old-image.png"],
        },
        images: {
          type: "array",
          items: { type: "string", format: "binary" },
          description:
            "Product image files (max 10) - will be added to existing images",
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
      const tempPaths = files.map((file) => file.path);
      const optimizedPaths =
        await this.imageOptimizationService.optimizeMultipleImages(
          tempPaths,
          "./uploads/products",
          {
            preset: "large",
            quality: 80,
            convertToWebP: true,
            removeMetadata: true,
            preserveAspectRatio: true,
          }
        );

      const newImageUrls = optimizedPaths.map((filePath) =>
        filePath.replace("./uploads", "/uploads")
      );

      if (!updateProductDto.imageUrls) {
        updateProductDto.imageUrls = [];
      }
      updateProductDto.imageUrls.push(...newImageUrls);
    }

    const product = await this.updateProductUseCase.execute(
      id,
      updateProductDto
    );
    return ProductResponseDto.fromDomain(product);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete product" })
  @ApiParam({ name: "id", description: "Product UUID" })
  @ApiResponse({ status: 200, description: "Product deleted" })
  @ApiResponse({ status: 404, description: "Product not found" })
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.deleteProductUseCase.execute(id);
    return { message: "Product deleted successfully" };
  }
}
