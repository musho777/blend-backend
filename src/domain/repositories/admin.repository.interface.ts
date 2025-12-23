import { Admin } from '../entities/admin.entity';

export interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  findById(id: string): Promise<Admin | null>;
  create(admin: Admin): Promise<Admin>;
}

export const ADMIN_REPOSITORY = Symbol('ADMIN_REPOSITORY');
