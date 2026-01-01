import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeormEntity } from '@infrastructure/database/entities/user.typeorm-entity';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { UserManagementController } from '@presentation/controllers/user-management.controller';
import { GetAllUsersUseCase } from '@application/use-cases/user/get-all-users.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTypeormEntity]),
  ],
  controllers: [UserManagementController],
  providers: [
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class UserManagementModule {}
