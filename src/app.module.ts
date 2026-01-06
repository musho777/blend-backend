import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UserAuthModule } from './modules/user-auth.module';
import { UserManagementModule } from './modules/user-management.module';
import { ProductModule } from './modules/product.module';
import { CategoryModule } from './modules/category.module';
import { SubcategoryModule } from './modules/subcategory.module';
import { BannerModule } from './modules/banner.module';
import { HomeModule } from './modules/home.module';
import { OrderModule } from './modules/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    UserAuthModule,
    UserManagementModule,
    ProductModule,
    CategoryModule,
    SubcategoryModule,
    BannerModule,
    HomeModule,
    OrderModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
