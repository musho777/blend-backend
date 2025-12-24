import { ValidationPipe, ArgumentMetadata } from "@nestjs/common";

export class FileUploadValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: false, // Allow file fields
      transform: true,
    });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (value && typeof value === "object") {
      const { images, image, ...cleanValue } = value;
      return super.transform(cleanValue, metadata);
    }

    return super.transform(value, metadata);
  }
}
