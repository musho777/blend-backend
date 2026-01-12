import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAdminRepository, ADMIN_REPOSITORY } from '@domain/repositories/admin.repository.interface';
import { JwtPayload } from './strategies/jwt.strategy';
import { LoginResponseDto } from '@presentation/dtos/auth/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepository: IAdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.adminRepository.findByEmail(email.toLowerCase());

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return admin;
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const admin = await this.validateAdmin(email, password);

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return new LoginResponseDto(accessToken, admin.email, admin.role);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
