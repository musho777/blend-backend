import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryTypeormEntity } from './category.typeorm-entity';

@Entity('subcategories')
export class SubcategoryTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'title_am', default: '' })
  titleAm: string;

  @Column({ name: 'title_ru', default: '' })
  titleRu: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => CategoryTypeormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryTypeormEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
