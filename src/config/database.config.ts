import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductTypeormEntity } from '@infrastructure/database/entities/product.typeorm-entity';
import { CategoryTypeormEntity } from '@infrastructure/database/entities/category.typeorm-entity';
import { SubcategoryTypeormEntity } from '@infrastructure/database/entities/subcategory.typeorm-entity';
import { OrderTypeormEntity } from '@infrastructure/database/entities/order.typeorm-entity';
import { AdminTypeormEntity } from '@infrastructure/database/entities/admin.typeorm-entity';
import { BannerTypeormEntity } from '@infrastructure/database/entities/banner.typeorm-entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'postgres'),
  password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
  database: configService.get<string>('DATABASE_NAME', 'blend'),
  entities: [
    ProductTypeormEntity,
    CategoryTypeormEntity,
    SubcategoryTypeormEntity,
    OrderTypeormEntity,
    AdminTypeormEntity,
    BannerTypeormEntity,
  ],
  synchronize: true, // Set to false in production and use migrations
  logging: configService.get<string>('NODE_ENV') === 'development',
});
