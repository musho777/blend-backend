import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Admin email' })
  email: string;

  @ApiProperty({ example: 'admin', description: 'Admin role' })
  role: string;

  constructor(accessToken: string, email: string, role: string) {
    this.accessToken = accessToken;
    this.email = email;
    this.role = role;
  }
}
