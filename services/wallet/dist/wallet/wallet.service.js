"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./wallet.entity");
const transaction_entity_1 = require("./transaction.entity");
let WalletService = class WalletService {
    constructor(walletRepository, transactionRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }
    async getBalance(userId) {
        return this.walletRepository.findOne({ where: { userId } });
    }
    async deposit(userId, amount, provider) {
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
    async lockEscrow(userId, amount, matchId) {
        const wallet = await this.getOrCreateWallet(userId);
        if (wallet.balance < amount)
            throw new Error('Insufficient balance');
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
    async releaseEscrow(winnerId, loserId, amount, matchId) {
        const winnerWallet = await this.getOrCreateWallet(winnerId);
        winnerWallet.escrowLocked -= amount;
        winnerWallet.balance += amount * 2 * 0.9;
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
    async getOrCreateWallet(userId) {
        let wallet = await this.walletRepository.findOne({ where: { userId } });
        if (!wallet) {
            wallet = this.walletRepository.create({ userId });
            await this.walletRepository.save(wallet);
        }
        return wallet;
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WalletService);
//# sourceMappingURL=wallet.service.js.map