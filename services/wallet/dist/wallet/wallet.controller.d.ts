import { WalletService } from './wallet.service';
export declare class WalletController {
    private walletService;
    constructor(walletService: WalletService);
    getBalance(userId: string): Promise<import("./wallet.entity").Wallet>;
    deposit(body: {
        userId: string;
        amount: number;
        provider: string;
    }): Promise<import("./transaction.entity").Transaction>;
    lockEscrow(body: {
        userId: string;
        amount: number;
        matchId: string;
    }): Promise<{
        message: string;
    }>;
    releaseEscrow(body: {
        winnerId: string;
        loserId: string;
        amount: number;
        matchId: string;
    }): Promise<{
        message: string;
    }>;
}
