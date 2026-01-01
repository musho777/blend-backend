import { Inject, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import * as bcrypt from 'bcrypt';

export interface LoginUserInput {
  email: string;
  password: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginUserInput): Promise<{
    accessToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      isVerified: boolean;
    };
  }> {
    const { email, password } = input;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new BadRequestException('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: 'user' };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    };
  }
}
