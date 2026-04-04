import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { Match } from './matchmaking/match.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/matchmaking.db',
      entities: [Match],
      synchronize: true,
    }),
    MatchmakingModule,
  ],
})
export class AppModule {}