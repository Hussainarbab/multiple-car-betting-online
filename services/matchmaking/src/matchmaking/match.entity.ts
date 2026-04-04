import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  player1Id: string;

  @Column('uuid')
  player2Id: string;

  @Column('decimal', { precision: 18, scale: 2 })
  wagerAmount: number;

  @Column({ default: 'waiting' })
  status: string;

  @Column('uuid', { nullable: true })
  winnerId: string;

  @Column('uuid')
  trackId: string;

  @CreateDateColumn()
  startTime: Date;

  @UpdateDateColumn()
  endTime: Date;

  @Column('jsonb', { nullable: true })
  serverLog: object;
}