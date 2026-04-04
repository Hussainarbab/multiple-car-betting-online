import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column('decimal', { precision: 18, scale: 2, default: 0 })
  escrowLocked: number;

  @Column({ default: 'USD' })
  currency: string;

  @UpdateDateColumn()
  updatedAt: Date;
}