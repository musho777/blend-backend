import { Injectable, Logger } from '@nestjs/common';
import { Storage, Bucket } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GoogleCloudStorageService {
  private readonly logger = new Logger(GoogleCloudStorageService.name);
  private storage: Storage;
  private bucket: Bucket;

  constructor(private configService: ConfigService) {
    const projectId = this.configService.get<string>('PROJECT_ID');
    const keyFilename = this.configService.get<string>('KEYFILENAME');
    const bucketName = this.configService.get<string>('BUCKET_NAME');

    if (!projectId || !keyFilename || !bucketName) {
      this.logger.error(
        'Missing required GCS configuration. Please check PROJECT_ID, KEYFILENAME, and BUCKET_NAME in .env'
      );
      throw new Error('Missing required GCS configuration');
    }

    this.storage = new Storage({
      projectId,
      keyFilename,
    });

    this.bucket = this.storage.bucket(bucketName);
    this.logger.log(`Google Cloud Storage initialized with bucket: ${bucketName}`);
  }

  /**
   * Upload a single file to Google Cloud Storage
   * @param localFilePath - Local file path to upload
   * @param destinationPath - Destination path in GCS bucket (e.g., 'products/image.webp')
   * @param makePublic - Whether to make the file publicly accessible (only works if uniform bucket-level access is disabled)
   * @returns Public URL of the uploaded file
   */
  async uploadFile(
    localFilePath: string,
    destinationPath: string,
    makePublic: boolean = true
  ): Promise<string> {
    try {
      if (!fs.existsSync(localFilePath)) {
        throw new Error(`File not found: ${localFilePath}`);
      }

      this.logger.log(`Uploading ${path.basename(localFilePath)} to GCS...`);

      await this.bucket.upload(localFilePath, {
        destination: destinationPath,
        metadata: {
          cacheControl: 'public, max-age=31536000', // Cache for 1 year
        },
      });

      const file = this.bucket.file(destinationPath);

      // Try to make public, but don't fail if uniform bucket-level access is enabled
      if (makePublic) {
        try {
          await file.makePublic();
          this.logger.log('File set to public');
        } catch (error) {
          if (error.message.includes('uniform bucket-level access')) {
            this.logger.warn(
              'Bucket has uniform bucket-level access enabled. ' +
              'Please ensure the bucket is configured for public access at the bucket level.'
            );
          } else {
            throw error;
          }
        }
      }

      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${destinationPath}`;

      this.logger.log(`Successfully uploaded to: ${publicUrl}`);

      // Delete local file after successful upload
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        this.logger.log(`Deleted local file: ${path.basename(localFilePath)}`);
      }

      return publicUrl;
    } catch (error) {
      this.logger.error(`Failed to upload file to GCS: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Upload multiple files to Google Cloud Storage
   * @param localFilePaths - Array of local file paths to upload
   * @param destinationFolder - Destination folder in GCS bucket (e.g., 'products')
   * @param makePublic - Whether to make the files publicly accessible
   * @returns Array of public URLs of the uploaded files
   */
  async uploadMultipleFiles(
    localFilePaths: string[],
    destinationFolder: string,
    makePublic: boolean = true
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const localFilePath of localFilePaths) {
      try {
        const filename = path.basename(localFilePath);
        const destinationPath = `${destinationFolder}/${filename}`;
        const url = await this.uploadFile(localFilePath, destinationPath, makePublic);
        uploadedUrls.push(url);
      } catch (error) {
        this.logger.error(`Failed to upload ${localFilePath}:`, error);
        // Continue with other files even if one fails
      }
    }

    return uploadedUrls;
  }

  /**
   * Delete a file from Google Cloud Storage
   * @param filePath - Path of the file in GCS bucket (e.g., 'products/image.webp')
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      // Extract the path from the URL if a full URL is provided
      const pathToDelete = this.extractPathFromUrl(filePath);

      const file = this.bucket.file(pathToDelete);
      const [exists] = await file.exists();

      if (!exists) {
        this.logger.warn(`File not found in GCS: ${pathToDelete}`);
        return;
      }

      await file.delete();
      this.logger.log(`Deleted file from GCS: ${pathToDelete}`);
    } catch (error) {
      this.logger.error(`Failed to delete file from GCS: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete multiple files from Google Cloud Storage
   * @param filePaths - Array of file paths or URLs to delete
   */
  async deleteMultipleFiles(filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
      try {
        await this.deleteFile(filePath);
      } catch (error) {
        this.logger.error(`Failed to delete ${filePath}:`, error);
        // Continue with other files even if one fails
      }
    }
  }

  /**
   * Extract the GCS path from a full URL
   * @param urlOrPath - Full GCS URL or path
   * @returns The path portion of the URL
   */
  private extractPathFromUrl(urlOrPath: string): string {
    // If it's a full URL, extract the path
    if (urlOrPath.startsWith('https://storage.googleapis.com/')) {
      const bucketPrefix = `https://storage.googleapis.com/${this.bucket.name}/`;
      return urlOrPath.replace(bucketPrefix, '');
    }
    // Otherwise, assume it's already a path
    return urlOrPath;
  }

  /**
   * Check if a file exists in GCS
   * @param filePath - Path of the file in GCS bucket
   * @returns True if the file exists, false otherwise
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const pathToCheck = this.extractPathFromUrl(filePath);
      const file = this.bucket.file(pathToCheck);
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      this.logger.error(`Error checking file existence: ${error.message}`);
      return false;
    }
  }
}
