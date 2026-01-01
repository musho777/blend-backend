import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { IVerificationCodeRepository, VERIFICATION_CODE_REPOSITORY } from '@domain/repositories/verification-code.repository.interface';
import { VerificationCode } from '@domain/entities/verification-code.entity';
import { EmailService } from '@common/services/email.service';
import { v4 as uuidv4 } from 'uuid';

export interface ResendCodeInput {
  email: string;
}

@Injectable()
export class ResendVerificationCodeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(VERIFICATION_CODE_REPOSITORY)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: ResendCodeInput): Promise<{ message: string }> {
    const { email } = input;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    await this.verificationCodeRepository.deleteByUserId(user.id);

    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const verificationCode = new VerificationCode(
      uuidv4(),
      user.id,
      code,
      expiresAt,
      new Date(),
    );

    await this.verificationCodeRepository.create(verificationCode);

    await this.emailService.sendVerificationEmail(email, code, user.firstName);

    return {
      message: 'Verification code has been resent to your email.',
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
