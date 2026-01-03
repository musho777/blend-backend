import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserTypeormEntity } from './user.typeorm-entity';
import { ProductTypeormEntity } from './product.typeorm-entity';

@Entity('orders')
export class OrderTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_name' })
  customerName: string;

  @Column({ name: 'customer_surname' })
  customerSurname: string;

  @Column({ name: 'customer_address' })
  customerAddress: string;

  @Column({ name: 'customer_phone' })
  customerPhone: string;

  @Column({ name: 'payment_method' })
  paymentMethod: string;

  @Column('decimal', { name: 'total_price', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderItemTypeormEntity, (item) => item.order, { cascade: true, eager: true })
  items: OrderItemTypeormEntity[];

  @ManyToOne(() => UserTypeormEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserTypeormEntity;
}

@Entity('order_items')
export class OrderItemTypeormEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'product_id' })
  productId: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  name: string;

  @ManyToOne(() => OrderTypeormEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderTypeormEntity;

  @ManyToOne(() => ProductTypeormEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductTypeormEntity;
}
