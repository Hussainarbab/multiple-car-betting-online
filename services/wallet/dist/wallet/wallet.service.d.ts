import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
export declare class WalletService {
    private walletRepository;
    private transactionRepository;
    constructor(walletRepository: Repository<Wallet>, transactionRepository: Repository<Transaction>);
    getBalance(userId: string): Promise<Wallet>;
    deposit(userId: string, amount: number, provider: string): Promise<Transaction>;
    lockEscrow(userId: string, amount: number, matchId: string): Promise<void>;
    releaseEscrow(winnerId: string, loserId: string, amount: number, matchId: string): Promise<void>;
    private getOrCreateWallet;
}
