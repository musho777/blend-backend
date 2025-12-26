import { Banner } from '../entities/banner.entity';

export const BANNER_REPOSITORY = 'BANNER_REPOSITORY';

export interface IBannerRepository {
  create(banner: Banner): Promise<Banner>;
  findAll(): Promise<Banner[]>;
  findById(id: string): Promise<Banner | null>;
  findActive(): Promise<Banner[]>;
  update(id: string, banner: Banner): Promise<Banner>;
  delete(id: string): Promise<void>;
}
