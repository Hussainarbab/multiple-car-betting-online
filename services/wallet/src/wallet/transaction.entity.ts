import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  type: string; // deposit, withdrawal, wager, payout

  @Column('decimal', { precision: 18, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  paymentProvider: string;

  @Column('uuid', { nullable: true })
  escrowMatchId: string;

  @CreateDateColumn()
  createdAt: Date;
}