import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { CreateSubcategoryDto } from '../dtos/subcategory/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dtos/subcategory/update-subcategory.dto';
import { SubcategoryResponseDto } from '../dtos/subcategory/subcategory-response.dto';
import { CreateSubcategoryUseCase } from '@application/use-cases/subcategory/create-subcategory.use-case';
import { UpdateSubcategoryUseCase } from '@application/use-cases/subcategory/update-subcategory.use-case';
import { DeleteSubcategoryUseCase } from '@application/use-cases/subcategory/delete-subcategory.use-case';
import { GetSubcategoriesUseCase } from '@application/use-cases/subcategory/get-subcategories.use-case';
import { GetSubcategoryByIdUseCase } from '@application/use-cases/subcategory/get-subcategory-by-id.use-case';
import { GetSubcategoriesByCategoryIdUseCase } from '@application/use-cases/subcategory/get-subcategories-by-category-id.use-case';

@ApiTags('Subcategories')
@ApiBearerAuth('JWT-auth')
@Controller('subcategories')
@UseGuards(JwtAuthGuard)
export class SubcategoryController {
  constructor(
    private readonly createSubcategoryUseCase: CreateSubcategoryUseCase,
    private readonly updateSubcategoryUseCase: UpdateSubcategoryUseCase,
    private readonly deleteSubcategoryUseCase: DeleteSubcategoryUseCase,
    private readonly getSubcategoriesUseCase: GetSubcategoriesUseCase,
    private readonly getSubcategoryByIdUseCase: GetSubcategoryByIdUseCase,
    private readonly getSubcategoriesByCategoryIdUseCase: GetSubcategoriesByCategoryIdUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all subcategories' })
  @ApiResponse({
    status: 200,
    description: 'List of all subcategories',
    type: [SubcategoryResponseDto],
  })
  async findAll(): Promise<SubcategoryResponseDto[]> {
    const subcategories = await this.getSubcategoriesUseCase.execute();
    return SubcategoryResponseDto.fromDomainArray(subcategories);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subcategory by ID' })
  @ApiParam({ name: 'id', description: 'Subcategory UUID' })
  @ApiResponse({
    status: 200,
    description: 'Subcategory found',
    type: SubcategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  async findOne(@Param('id') id: string): Promise<SubcategoryResponseDto> {
    const subcategory = await this.getSubcategoryByIdUseCase.execute(id);
    return SubcategoryResponseDto.fromDomain(subcategory);
  }

  @Post()
  @ApiOperation({ summary: 'Create new subcategory' })
  @ApiResponse({
    status: 201,
    description: 'Subcategory created',
    type: SubcategoryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async create(
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<SubcategoryResponseDto> {
    const subcategory = await this.createSubcategoryUseCase.execute(createSubcategoryDto);
    return SubcategoryResponseDto.fromDomain(subcategory);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update subcategory' })
  @ApiParam({ name: 'id', description: 'Subcategory UUID' })
  @ApiResponse({
    status: 200,
    description: 'Subcategory updated',
    type: SubcategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Subcategory or Category not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<SubcategoryResponseDto> {
    const subcategory = await this.updateSubcategoryUseCase.execute(id, updateSubcategoryDto);
    return SubcategoryResponseDto.fromDomain(subcategory);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete subcategory' })
  @ApiParam({ name: 'id', description: 'Subcategory UUID' })
  @ApiResponse({ status: 200, description: 'Subcategory deleted' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.deleteSubcategoryUseCase.execute(id);
    return { message: 'Subcategory deleted successfully' };
  }
}
