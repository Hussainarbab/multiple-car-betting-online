export declare class Transaction {
    id: string;
    userId: string;
    type: string;
    amount: number;
    status: string;
    paymentProvider: string;
    escrowMatchId: string;
    createdAt: Date;
}
