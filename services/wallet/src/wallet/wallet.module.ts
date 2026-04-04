import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction]),
    PassportModule,
  ],
  providers: [WalletService, JwtStrategy],
  controllers: [WalletController],
})
export class WalletModule {}