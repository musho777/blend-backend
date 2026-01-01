import { VerificationCode } from '../entities/verification-code.entity';

export interface IVerificationCodeRepository {
  create(code: VerificationCode): Promise<VerificationCode>;
  findByUserId(userId: string): Promise<VerificationCode | null>;
  findByUserIdAndCode(userId: string, code: string): Promise<VerificationCode | null>;
  deleteByUserId(userId: string): Promise<void>;
}

export const VERIFICATION_CODE_REPOSITORY = Symbol('VERIFICATION_CODE_REPOSITORY');
