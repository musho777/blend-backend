import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { IVerificationCodeRepository, VERIFICATION_CODE_REPOSITORY } from '@domain/repositories/verification-code.repository.interface';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { EmailService } from '@common/services/email.service';

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(VERIFICATION_CODE_REPOSITORY)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: VerifyEmailInput): Promise<{
    message: string;
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
    const { email, otp } = input;

    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationCode = await this.verificationCodeRepository.findByUserIdAndCode(user.id, otp);
    if (!verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    if (new Date() > verificationCode.expiresAt) {
      throw new BadRequestException('Verification code has expired');
    }

    await this.userRepository.update(user.id, { isVerified: true });

    await this.verificationCodeRepository.deleteByUserId(user.id);

    await this.emailService.sendWelcomeEmail(email, user.firstName);

    const payload = { sub: user.id, email: user.email, role: 'user' };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Email verified successfully',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isVerified: true,
      },
    };
  }
}
