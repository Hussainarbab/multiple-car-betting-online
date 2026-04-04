import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { Redis } from 'ioredis';

@Injectable()
export class MatchmakingService {
  private redis = new Redis();

  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  async joinQueue(userId: string, wagerAmount: number, skillRange: number): Promise<string> {
    const queueKey = `queue:skill:${Math.floor(skillRange / 100) * 100}`;
    await this.redis.zadd(queueKey, Date.now(), `${userId}:${wagerAmount}`);
    return this.findMatch(userId, wagerAmount, skillRange);
  }

  private async findMatch(userId: string, wagerAmount: number, skillRange: number): Promise<string> {
    const queueKey = `queue:skill:${Math.floor(skillRange / 100) * 100}`;
    const opponents = await this.redis.zrange(queueKey, 0, -1);
    for (const opp of opponents) {
      const [oppId, oppWager] = opp.split(':');
      if (oppId !== userId && parseFloat(oppWager) === wagerAmount) {
        await this.redis.zrem(queueKey, opp);
        const match = this.matchRepository.create({
          player1Id: userId,
          player2Id: oppId,
          wagerAmount,
          trackId: 'default-track', // Randomize later
        });
        const savedMatch = await this.matchRepository.save(match);
        return savedMatch.id;
      }
    }
    return null;
  }

  async getMatchStatus(matchId: string): Promise<Match> {
    return this.matchRepository.findOne({ where: { id: matchId } });
  }
}