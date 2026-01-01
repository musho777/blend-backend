import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
