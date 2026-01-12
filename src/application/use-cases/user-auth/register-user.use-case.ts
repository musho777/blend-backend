import { Inject, Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { IVerificationCodeRepository, VERIFICATION_CODE_REPOSITORY } from '@domain/repositories/verification-code.repository.interface';
import { User } from '@domain/entities/user.entity';
import { VerificationCode } from '@domain/entities/verification-code.entity';
import { EmailService } from '@common/services/email.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterUserInput {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(VERIFICATION_CODE_REPOSITORY)
    private readonly verificationCodeRepository: IVerificationCodeRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: RegisterUserInput): Promise<{ userId: string; message: string }> {
    const { email, password, confirmPassword, firstName, lastName, phone } = input;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User(
      uuidv4(),
      normalizedEmail,
      passwordHash,
      firstName,
      lastName,
      phone,
      false,
      undefined,
      new Date(),
      new Date(),
    );

    const savedUser = await this.userRepository.create(user);

    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const verificationCode = new VerificationCode(
      uuidv4(),
      savedUser.id,
      code,
      expiresAt,
      new Date(),
    );

    await this.verificationCodeRepository.create(verificationCode);

    await this.emailService.sendVerificationEmail(email, code, firstName);

    return {
      userId: savedUser.id,
      message: 'Registration successful. Please check your email for verification code.',
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
