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
  UploadedFile,
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
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { ImageOptimizationService } from "@common/services/image-optimization.service";
import { FileUploadValidationPipe } from "@common/pipes/file-upload-validation.pipe";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";
import { CategoryResponseDto } from "../dtos/category/category-response.dto";
import { GetProductsByCategoryQueryDto } from "../dtos/category/get-products-by-category-query.dto";
import { CreateCategoryUseCase } from "@application/use-cases/category/create-category.use-case";
import { UpdateCategoryUseCase } from "@application/use-cases/category/update-category.use-case";
import { DeleteCategoryUseCase } from "@application/use-cases/category/delete-category.use-case";
import { GetCategoriesUseCase } from "@application/use-cases/category/get-categories.use-case";
import { GetCategoryByIdUseCase } from "@application/use-cases/category/get-category-by-id.use-case";
import { GetSubcategoriesByCategoryIdUseCase } from "@application/use-cases/subcategory/get-subcategories-by-category-id.use-case";
import { GetProductsByCategoryUseCase } from "@application/use-cases/product/get-products-by-category.use-case";
import { SubcategoryResponseDto } from "../dtos/subcategory/subcategory-response.dto";
import { ProductResponseDto } from "../dtos/product/product-response.dto";
import {
  PaginationDto,
  PaginatedResponseDto,
} from "../dtos/common/pagination.dto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/categories/temp";
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

@ApiTags("Categories")
@Controller("categories")
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly getSubcategoriesByCategoryIdUseCase: GetSubcategoriesByCategoryIdUseCase,
    private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private readonly imageOptimizationService: ImageOptimizationService
  ) {}

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({
    status: 200,
    description: "List of all categories",
    type: [CategoryResponseDto],
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.getCategoriesUseCase.execute();
    return CategoryResponseDto.fromDomainArray(categories);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by ID" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({
    status: 200,
    description: "Category found",
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: "Category not found" })
  async findOne(@Param("id") id: string): Promise<CategoryResponseDto> {
    const category = await this.getCategoryByIdUseCase.execute(id);
    return CategoryResponseDto.fromDomain(category);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @UseInterceptors(
    FileInterceptor("image", {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  @ApiOperation({ summary: "Create new category" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Category data with optional image file",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "Electronics" },
        slug: { type: "string", example: "electronics" },
        image: {
          type: "string",
          format: "binary",
          description: "Category image file",
        },
      },
      required: ["title"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Category created",
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async create(
    @Body(FileUploadValidationPipe) createCategoryDto: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<CategoryResponseDto> {
    if (file) {
      const optimizedPaths =
        await this.imageOptimizationService.optimizeMultipleImages(
          [file.path],
          "./uploads/categories",
          {
            preset: "medium",
            quality: 85,
            convertToWebP: true,
            removeMetadata: true,
            preserveAspectRatio: true,
          }
        );

      createCategoryDto.image = optimizedPaths[0].replace(
        "./uploads",
        "/uploads"
      );
    }

    const category = await this.createCategoryUseCase.execute(
      createCategoryDto
    );
    return CategoryResponseDto.fromDomain(category);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @UseInterceptors(
    FileInterceptor("image", {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  @ApiOperation({ summary: "Update category" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description:
      "Category data with optional image file to replace existing image",
    schema: {
      type: "object",
      properties: {
        title: { type: "string", example: "Consumer Electronics" },
        slug: { type: "string", example: "consumer-electronics" },
        image: {
          type: "string",
          format: "binary",
          description: "New category image file (replaces existing)",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Category updated",
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: "Category not found" })
  async update(
    @Param("id") id: string,
    @Body(FileUploadValidationPipe) updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<CategoryResponseDto> {
    if (file) {
      const optimizedPaths =
        await this.imageOptimizationService.optimizeMultipleImages(
          [file.path],
          "./uploads/categories",
          {
            preset: "medium",
            quality: 85,
            convertToWebP: true,
            removeMetadata: true,
            preserveAspectRatio: true,
          }
        );

      updateCategoryDto.image = optimizedPaths[0].replace(
        "./uploads",
        "/uploads"
      );
    }

    const category = await this.updateCategoryUseCase.execute(
      id,
      updateCategoryDto
    );
    return CategoryResponseDto.fromDomain(category);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Delete category" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({ status: 200, description: "Category deleted" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.deleteCategoryUseCase.execute(id);
    return { message: "Category deleted successfully" };
  }

  @Get(":id/subcategories")
  @ApiOperation({ summary: "Get all subcategories for a specific category" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({
    status: 200,
    description: "List of subcategories belonging to the category",
    type: [SubcategoryResponseDto],
  })
  async getSubcategories(
    @Param("id") id: string
  ): Promise<SubcategoryResponseDto[]> {
    const subcategories =
      await this.getSubcategoriesByCategoryIdUseCase.execute(id);
    return SubcategoryResponseDto.fromDomainArray(subcategories);
  }

  @Get(":id/products")
  @ApiOperation({
    summary:
      "Get all products for a specific category with optional pagination, subcategory filter, and sorting",
  })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({
    status: 200,
    description:
      "List of products belonging to the category with pagination metadata",
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
            total: { type: "number", example: 50 },
            pages: { type: "number", example: 5 },
            hasNext: { type: "boolean", example: true },
            hasPrevious: { type: "boolean", example: false },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Category not found" })
  async getProducts(
    @Param("id") id: string,
    @Query() queryDto: GetProductsByCategoryQueryDto
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = queryDto.skip;
    console.log(queryDto.subcategoryId);
    const result = await this.getProductsByCategoryUseCase.executePaginated(
      id,
      {
        page,
        limit,
        skip,
      },
      queryDto.subcategoryId,
      queryDto.search,
      queryDto.sortBy
    );

    const productDtos = ProductResponseDto.fromDomainArray(result.data);

    return PaginatedResponseDto.create(productDtos, result.total, page, limit);
  }
}
