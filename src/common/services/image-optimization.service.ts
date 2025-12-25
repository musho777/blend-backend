import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

export interface ImagePreset {
  name: string;
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

export interface OptimizationOptions {
  preset?: string;
  quality?: number;
  preserveAspectRatio?: boolean;
  removeMetadata?: boolean;
  convertToWebP?: boolean;
}

@Injectable()
export class ImageOptimizationService {
  private readonly logger = new Logger(ImageOptimizationService.name);
  
  private readonly presets: Record<string, ImagePreset> = {
    thumbnail: { name: 'thumbnail', maxWidth: 150, maxHeight: 150, quality: 80 },
    small: { name: 'small', maxWidth: 300, maxHeight: 300, quality: 80 },
    medium: { name: 'medium', maxWidth: 600, maxHeight: 600, quality: 80 },
    large: { name: 'large', maxWidth: 1200, maxHeight: 1200, quality: 80 },
    xlarge: { name: 'xlarge', maxWidth: 1920, maxHeight: 1920, quality: 80 },
  };

  async optimizeImage(
    inputPath: string,
    outputPath: string,
    options: OptimizationOptions = {}
  ): Promise<void> {
    const {
      preset = 'large',
      quality = 80,
      preserveAspectRatio = true,
      removeMetadata = true,
      convertToWebP = true,
    } = options;

    try {
      const imagePreset = this.presets[preset];
      if (!imagePreset) {
        throw new Error(`Invalid preset: ${preset}`);
      }

      // Check original file size
      const stats = fs.statSync(inputPath);
      const fileSizeKB = stats.size / 1024;
      const shouldApplyQualityCompression = fileSizeKB > 100;

      const image = sharp(inputPath);
      const metadata = await image.metadata();

      this.logger.log(`Processing image: ${path.basename(inputPath)} (${metadata.width}x${metadata.height}, ${fileSizeKB.toFixed(2)}KB)`);

      let processedImage = image;

      if (removeMetadata) {
        processedImage = processedImage.withMetadata({});
      }

      const shouldResize = this.shouldResize(metadata, imagePreset);
      if (shouldResize) {
        const resizeOptions: sharp.ResizeOptions = {
          width: imagePreset.maxWidth,
          height: imagePreset.maxHeight,
          fit: preserveAspectRatio ? 'inside' : 'cover',
          withoutEnlargement: true,
        };

        processedImage = processedImage.resize(resizeOptions);
        this.logger.log(`Resizing to max ${imagePreset.maxWidth}x${imagePreset.maxHeight}`);
      } else {
        this.logger.log('No resizing needed - image within preset dimensions');
      }

      if (convertToWebP) {
        const webpOptions: sharp.WebpOptions = shouldApplyQualityCompression 
          ? { quality } 
          : { lossless: false, nearLossless: true };
        
        processedImage = processedImage.webp(webpOptions);
        const webpOutputPath = this.getWebPPath(outputPath);
        await processedImage.toFile(webpOutputPath);
        
        if (shouldApplyQualityCompression) {
          this.logger.log(`Converted to WebP with ${quality}% quality: ${path.basename(webpOutputPath)}`);
        } else {
          this.logger.log(`Converted to WebP with preserved quality (file < 100KB): ${path.basename(webpOutputPath)}`);
        }
      } else {
        const format = this.getOutputFormat(metadata.format);
        if (shouldApplyQualityCompression) {
          if (format === 'jpeg') {
            processedImage = processedImage.jpeg({ quality });
          } else if (format === 'png') {
            processedImage = processedImage.png({ compressionLevel: 6 });
          }
          this.logger.log(`Applied ${quality}% quality compression`);
        } else {
          if (format === 'jpeg') {
            processedImage = processedImage.jpeg({ quality: 95 });
          } else if (format === 'png') {
            processedImage = processedImage.png({ compressionLevel: 3 });
          }
          this.logger.log('Preserved original quality (file < 100KB)');
        }
        
        await processedImage.toFile(outputPath);
        this.logger.log(`Optimized ${format.toUpperCase()}: ${path.basename(outputPath)}`);
      }

    } catch (error) {
      this.logger.error(`Image optimization failed for ${inputPath}:`, error);
      throw error;
    }
  }

  async optimizeMultipleImages(
    inputPaths: string[],
    outputDir: string,
    options: OptimizationOptions = {}
  ): Promise<string[]> {
    const optimizedPaths: string[] = [];

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const inputPath of inputPaths) {
      try {
        const filename = path.basename(inputPath);
        const nameWithoutExt = path.parse(filename).name;
        const outputExtension = options.convertToWebP !== false ? '.webp' : path.extname(inputPath);
        const outputPath = path.join(outputDir, `${nameWithoutExt}${outputExtension}`);

        await this.optimizeImage(inputPath, outputPath, options);
        optimizedPaths.push(outputPath);

        if (inputPath !== outputPath) {
          fs.unlinkSync(inputPath);
          this.logger.log(`Removed original file: ${path.basename(inputPath)}`);
        }
      } catch (error) {
        this.logger.error(`Failed to optimize ${inputPath}:`, error);
        optimizedPaths.push(inputPath);
      }
    }

    return optimizedPaths;
  }

  async getImageInfo(imagePath: string): Promise<sharp.Metadata> {
    try {
      const image = sharp(imagePath);
      return await image.metadata();
    } catch (error) {
      this.logger.error(`Failed to get image info for ${imagePath}:`, error);
      throw error;
    }
  }

  getAvailablePresets(): Record<string, ImagePreset> {
    return { ...this.presets };
  }

  private shouldResize(metadata: sharp.Metadata, preset: ImagePreset): boolean {
    if (!metadata.width || !metadata.height) {
      return false;
    }

    return metadata.width > preset.maxWidth || metadata.height > preset.maxHeight;
  }

  private getWebPPath(originalPath: string): string {
    const parsed = path.parse(originalPath);
    return path.join(parsed.dir, `${parsed.name}.webp`);
  }

  private getOutputFormat(inputFormat?: string): 'jpeg' | 'png' | 'webp' {
    if (!inputFormat) return 'jpeg';
    
    switch (inputFormat.toLowerCase()) {
      case 'png':
        return 'png';
      case 'webp':
        return 'webp';
      case 'jpg':
      case 'jpeg':
      default:
        return 'jpeg';
    }
  }
}