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
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";
import { CategoryResponseDto } from "../dtos/category/category-response.dto";
import { CreateCategoryUseCase } from "@application/use-cases/category/create-category.use-case";
import { UpdateCategoryUseCase } from "@application/use-cases/category/update-category.use-case";
import { DeleteCategoryUseCase } from "@application/use-cases/category/delete-category.use-case";
import { GetCategoriesUseCase } from "@application/use-cases/category/get-categories.use-case";
import { GetCategoryByIdUseCase } from "@application/use-cases/category/get-category-by-id.use-case";

@ApiTags("Categories")
@ApiBearerAuth("JWT-auth")
@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase
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
  @ApiOperation({ summary: "Create new category" })
  @ApiResponse({
    status: 201,
    description: "Category created",
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async create(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<CategoryResponseDto> {
    const category = await this.createCategoryUseCase.execute(
      createCategoryDto
    );
    return CategoryResponseDto.fromDomain(category);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update category" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({
    status: 200,
    description: "Category updated",
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: "Category not found" })
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    const category = await this.updateCategoryUseCase.execute(
      id,
      updateCategoryDto
    );
    return CategoryResponseDto.fromDomain(category);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete category" })
  @ApiParam({ name: "id", description: "Category UUID" })
  @ApiResponse({ status: 200, description: "Category deleted" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async remove(@Param("id") id: string): Promise<{ message: string }> {
    await this.deleteCategoryUseCase.execute(id);
    return { message: "Category deleted successfully" };
  }
}
