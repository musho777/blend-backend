import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { UserResponseDto } from '@presentation/dtos/user/user-response.dto';
import { GetAllUsersUseCase } from '@application/use-cases/user/get-all-users.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';

@ApiTags('Admin - User Management')
@ApiBearerAuth('JWT-auth')
@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class UserManagementController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Admin can view all registered users'
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.getAllUsersUseCase.execute();

    return users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isVerified: user.isVerified,
      googleId: user.googleId,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    }));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Admin can view detailed information about a specific user'
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserByIdUseCase.execute(id);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isVerified: user.isVerified,
      googleId: user.googleId,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}
