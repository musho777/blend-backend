import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User UUID' })
  id: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  phone: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  isVerified: boolean;

  @ApiProperty({ example: '123456789', description: 'Google ID if registered via Google OAuth', required: false })
  googleId?: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Account creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T14:45:00Z', description: 'Last update timestamp' })
  updatedAt: string;
}
