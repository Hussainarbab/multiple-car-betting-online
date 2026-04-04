import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getBalance(userId: string): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { userId } });
  }

  async deposit(userId: string, amount: number, provider: string): Promise<Transaction> {
    const wallet = await this.getOrCreateWallet(userId);
    wallet.balance += amount;
    await this.walletRepository.save(wallet);

    const transaction = this.transactionRepository.create({
      userId,
      type: 'deposit',
      amount,
      status: 'completed',
      paymentProvider: provider,
    });
    return this.transactionRepository.save(transaction);
  }

  async lockEscrow(userId: string, amount: number, matchId: string): Promise<void> {
    const wallet = await this.getOrCreateWallet(userId);
    if (wallet.balance < amount) throw new Error('Insufficient balance');
    wallet.balance -= amount;
    wallet.escrowLocked += amount;
    await this.walletRepository.save(wallet);

    await this.transactionRepository.save({
      userId,
      type: 'wager',
      amount,
      status: 'completed',
      escrowMatchId: matchId,
    });
  }

  async releaseEscrow(winnerId: string, loserId: string, amount: number, matchId: string): Promise<void> {
    const winnerWallet = await this.getOrCreateWallet(winnerId);
    winnerWallet.escrowLocked -= amount;
    winnerWallet.balance += amount * 2 * 0.9; // 90% after fee
    await this.walletRepository.save(winnerWallet);

    const loserWallet = await this.getOrCreateWallet(loserId);
    loserWallet.escrowLocked -= amount;
    await this.walletRepository.save(loserWallet);

    await this.transactionRepository.save({
      userId: winnerId,
      type: 'payout',
      amount: amount * 2 * 0.9,
      status: 'completed',
      escrowMatchId: matchId,
    });
  }

  private async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) {
      wallet = this.walletRepository.create({ userId });
      await this.walletRepository.save(wallet);
    }
    return wallet;
  }
}