import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/wallet.entity';
import { Transaction } from './wallet/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/wallet.db',
      entities: [Wallet, Transaction],
      synchronize: true,
    }),
    WalletModule,
  ],
})
export class AppModule {}