import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeormEntity } from '@infrastructure/database/entities/user.typeorm-entity';
import { VerificationCodeTypeormEntity } from '@infrastructure/database/entities/verification-code.typeorm-entity';
import { OrderTypeormEntity } from '@infrastructure/database/entities/order.typeorm-entity';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { VerificationCodeRepository } from '@infrastructure/repositories/verification-code.repository';
import { OrderRepository } from '@infrastructure/repositories/order.repository';
import { USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { VERIFICATION_CODE_REPOSITORY } from '@domain/repositories/verification-code.repository.interface';
import { ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { UserJwtStrategy } from '@auth/strategies/user-jwt.strategy';
import { GoogleStrategy } from '@auth/strategies/google.strategy';
import { UserAuthController } from '@presentation/controllers/user-auth.controller';
import { PublicOrderController } from '@presentation/controllers/order.controller';
import { RegisterUserUseCase } from '@application/use-cases/user-auth/register-user.use-case';
import { VerifyEmailUseCase } from '@application/use-cases/user-auth/verify-email.use-case';
import { ResendVerificationCodeUseCase } from '@application/use-cases/user-auth/resend-verification-code.use-case';
import { LoginUserUseCase } from '@application/use-cases/user-auth/login-user.use-case';
import { GoogleLoginUseCase } from '@application/use-cases/user-auth/google-login.use-case';
import { CreateOrderUseCase } from '@application/use-cases/order/create-order.use-case';
import { EmailService } from '@common/services/email.service';
import { ProductTypeormEntity } from '@infrastructure/database/entities/product.typeorm-entity';
import { ProductRepository } from '@infrastructure/repositories/product.repository';
import { PRODUCT_REPOSITORY } from '@domain/repositories/product.repository.interface';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '24h'),
        },
      }),
    }),
    TypeOrmModule.forFeature([
      UserTypeormEntity,
      VerificationCodeTypeormEntity,
      OrderTypeormEntity,
      ProductTypeormEntity,
    ]),
  ],
  controllers: [UserAuthController, PublicOrderController],
  providers: [
    EmailService,
    UserJwtStrategy,
    GoogleStrategy,
    RegisterUserUseCase,
    VerifyEmailUseCase,
    ResendVerificationCodeUseCase,
    LoginUserUseCase,
    GoogleLoginUseCase,
    CreateOrderUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: VERIFICATION_CODE_REPOSITORY,
      useClass: VerificationCodeRepository,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  exports: [UserJwtStrategy, GoogleStrategy],
})
export class UserAuthModule {}
