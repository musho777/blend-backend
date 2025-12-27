import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryTypeormEntity } from './category.typeorm-entity';
import { SubcategoryTypeormEntity } from './subcategory.typeorm-entity';

@Entity('products')
export class ProductTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'subcategory_id', nullable: true })
  subcategoryId: string;

  @Column('text', { nullable: true, default: '' })
  description: string;

  @Column('json', { name: 'image_urls', nullable: true, default: () => "'[]'" })
  imageUrls: string[];

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'is_best_seller', default: false })
  isBestSeller: boolean;

  @Column({ name: 'is_best_select', default: false })
  isBestSelect: boolean;

  @Column('int', { default: 0 })
  priority: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CategoryTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryTypeormEntity;

  @ManyToOne(() => SubcategoryTypeormEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SubcategoryTypeormEntity;
}
