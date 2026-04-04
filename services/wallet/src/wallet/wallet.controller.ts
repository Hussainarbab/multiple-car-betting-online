import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('balance/:userId')
  async getBalance(@Param('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }

  @Post('deposit')
  async deposit(@Body() body: { userId: string; amount: number; provider: string }) {
    return this.walletService.deposit(body.userId, body.amount, body.provider);
  }

  @Post('lock-escrow')
  async lockEscrow(@Body() body: { userId: string; amount: number; matchId: string }) {
    await this.walletService.lockEscrow(body.userId, body.amount, body.matchId);
    return { message: 'Escrow locked' };
  }

  @Post('release-escrow')
  async releaseEscrow(@Body() body: { winnerId: string; loserId: string; amount: number; matchId: string }) {
    await this.walletService.releaseEscrow(body.winnerId, body.loserId, body.amount, body.matchId);
    return { message: 'Escrow released' };
  }
}