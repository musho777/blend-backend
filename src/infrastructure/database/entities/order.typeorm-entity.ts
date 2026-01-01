import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductTypeormEntity } from './product.typeorm-entity';
import { UserTypeormEntity } from './user.typeorm-entity';

@Entity('orders')
export class OrderTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { name: 'total_price', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'guest_email', nullable: true })
  guestEmail: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => ProductTypeormEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductTypeormEntity;

  @ManyToOne(() => UserTypeormEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserTypeormEntity;
}
