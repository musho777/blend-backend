import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories/user.repository.interface';
import { IOrderRepository, ORDER_REPOSITORY } from '@domain/repositories/order.repository.interface';
import { User } from '@domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

export interface GoogleLoginInput {
  email: string;
  firstName: string;
  lastName: string;
  googleId: string;
}

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: GoogleLoginInput): Promise<{
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
    const { email, firstName, lastName, googleId } = input;

    let user = await this.userRepository.findByGoogleId(googleId);

    if (!user) {
      user = await this.userRepository.findByEmail(email);

      if (user) {
        await this.userRepository.update(user.id, {
          googleId,
          isVerified: true
        });
        user = await this.userRepository.findById(user.id);
      } else {
        const newUser = new User(
          uuidv4(),
          email,
          null,
          firstName,
          lastName,
          '',
          true,
          googleId,
          new Date(),
          new Date(),
        );

        user = await this.userRepository.create(newUser);
      }
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
