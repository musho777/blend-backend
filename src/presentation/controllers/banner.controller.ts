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
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ImageOptimizationService } from '@common/services/image-optimization.service';
import { GoogleCloudStorageService } from '@common/services/google-cloud-storage.service';
import { FileUploadValidationPipe } from '@common/pipes/file-upload-validation.pipe';
import { CreateBannerDto } from '../dtos/banner/create-banner.dto';
import { UpdateBannerDto } from '../dtos/banner/update-banner.dto';
import { BannerResponseDto } from '../dtos/banner/banner-response.dto';
import { CreateBannerUseCase } from '@application/use-cases/banner/create-banner.use-case';
import { UpdateBannerUseCase } from '@application/use-cases/banner/update-banner.use-case';
import { DeleteBannerUseCase } from '@application/use-cases/banner/delete-banner.use-case';
import { GetBannersUseCase } from '@application/use-cases/banner/get-banners.use-case';
import { GetBannerByIdUseCase } from '@application/use-cases/banner/get-banner-by-id.use-case';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/banners/temp';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Only image files are allowed'), false);
  }
};

@ApiTags('Banners')
@Controller('banners')
export class BannerController {
  constructor(
    private readonly createBannerUseCase: CreateBannerUseCase,
    private readonly updateBannerUseCase: UpdateBannerUseCase,
    private readonly deleteBannerUseCase: DeleteBannerUseCase,
    private readonly getBannersUseCase: GetBannersUseCase,
    private readonly getBannerByIdUseCase: GetBannerByIdUseCase,
    private readonly imageOptimizationService: ImageOptimizationService,
    private readonly gcsService: GoogleCloudStorageService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all banners', description: 'Returns all banners including inactive ones, sorted by priority ASC (lowest priority number appears first)' })
  @ApiResponse({
    status: 200,
    description: 'List of all banners sorted by priority',
    type: [BannerResponseDto],
  })
  async findAll(): Promise<BannerResponseDto[]> {
    const banners = await this.getBannersUseCase.execute();
    return BannerResponseDto.fromDomainArray(banners);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get banner by ID' })
  @ApiParam({ name: 'id', description: 'Banner UUID' })
  @ApiResponse({
    status: 200,
    description: 'Banner found',
    type: BannerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async findOne(@Param('id') id: string): Promise<BannerResponseDto> {
    const banner = await this.getBannerByIdUseCase.execute(id);
    return BannerResponseDto.fromDomain(banner);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Create new banner (Admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Banner data with image file',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: '/products?category=electronics' },
        text: { type: 'string', example: 'New Electronics Collection - Up to 50% Off' },
        isActive: { type: 'boolean', example: true },
        priority: { type: 'integer', example: 1, description: 'Display order priority (lower numbers appear first)', default: 1 },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Banner image file (JPEG, PNG, WebP)',
        },
      },
      required: ['url', 'image'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Banner created',
    type: BannerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Body(FileUploadValidationPipe) createBannerDto: CreateBannerDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<BannerResponseDto> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const optimizedPaths = await this.imageOptimizationService.optimizeMultipleImages(
      [file.path],
      './uploads/banners/temp-optimized',
      {
        preset: 'large',
        quality: 90,
        convertToWebP: true,
        removeMetadata: true,
        preserveAspectRatio: true,
      },
    );

    // Upload optimized image to Google Cloud Storage
    const gcsUrls = await this.gcsService.uploadMultipleFiles(
      optimizedPaths,
      'banners',
    );

    createBannerDto.image = gcsUrls[0];

    const banner = await this.createBannerUseCase.execute(createBannerDto);
    return BannerResponseDto.fromDomain(banner);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Update banner (Admin)' })
  @ApiParam({ name: 'id', description: 'Banner UUID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Banner data with optional image file to replace existing image',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: '/products?category=fashion' },
        text: { type: 'string', example: 'Fashion Sale - Limited Time Only' },
        isActive: { type: 'boolean', example: false },
        priority: { type: 'integer', example: 2, description: 'Display order priority (lower numbers appear first)' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'New banner image file (replaces existing)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Banner updated',
    type: BannerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async update(
    @Param('id') id: string,
    @Body(FileUploadValidationPipe) updateBannerDto: UpdateBannerDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<BannerResponseDto> {
    if (file) {
      const optimizedPaths = await this.imageOptimizationService.optimizeMultipleImages(
        [file.path],
        './uploads/banners/temp-optimized',
        {
          preset: 'large',
          quality: 90,
          convertToWebP: true,
          removeMetadata: true,
          preserveAspectRatio: true,
        },
      );

      // Upload optimized image to Google Cloud Storage
      const gcsUrls = await this.gcsService.uploadMultipleFiles(
        optimizedPaths,
        'banners',
      );

      updateBannerDto.image = gcsUrls[0];

      // Get existing banner to delete old image from GCS
      const existingBanner = await this.getBannerByIdUseCase.execute(id);
      if (existingBanner.image) {
        try {
          await this.gcsService.deleteFile(existingBanner.image);
        } catch (error) {
          // Log error but don't fail the update if old image deletion fails
          console.error('Failed to delete old banner image from GCS:', error);
        }
      }
    }

    const banner = await this.updateBannerUseCase.execute(id, updateBannerDto);
    return BannerResponseDto.fromDomain(banner);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete banner (Admin)' })
  @ApiParam({ name: 'id', description: 'Banner UUID' })
  @ApiResponse({ status: 200, description: 'Banner deleted' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.deleteBannerUseCase.execute(id);
    return { message: 'Banner deleted successfully' };
  }
}
