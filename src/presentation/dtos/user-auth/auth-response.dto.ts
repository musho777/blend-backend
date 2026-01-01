import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    isVerified: boolean;
  };
}

export class RegisterResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;
}

export class VerifyResponseDto {
  @ApiProperty({ description: 'Success message' })
  message: string;

  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'User information' })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    isVerified: boolean;
  };
}
