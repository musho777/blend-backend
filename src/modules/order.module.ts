import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTypeormEntity, OrderItemTypeormEntity } from '@infrastructure/database/entities/order.typeorm-entity';
import { OrderRepository } from '@infrastructure/repositories/order.repository';
import { ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { PublicOrderController, OrderController } from '@presentation/controllers/order.controller';
import { CreateOrderUseCase } from '@application/use-cases/order/create-order.use-case';
import { GetAllOrdersUseCase } from '@application/use-cases/order/get-all-orders.use-case';
import { GetOrderByIdUseCase } from '@application/use-cases/order/get-order-by-id.use-case';
import { UpdateOrderStatusUseCase } from '@application/use-cases/order/update-order-status.use-case';
import { DeleteOrderUseCase } from '@application/use-cases/order/delete-order.use-case';
import { ProductModule } from './product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderTypeormEntity, OrderItemTypeormEntity]),
    forwardRef(() => ProductModule),
  ],
  controllers: [PublicOrderController, OrderController],
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    CreateOrderUseCase,
    GetAllOrdersUseCase,
    GetOrderByIdUseCase,
    UpdateOrderStatusUseCase,
    DeleteOrderUseCase,
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrderModule {}
