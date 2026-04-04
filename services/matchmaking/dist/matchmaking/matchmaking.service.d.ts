import { Repository } from 'typeorm';
import { Match } from './match.entity';
export declare class MatchmakingService {
    private matchRepository;
    private redis;
    constructor(matchRepository: Repository<Match>);
    joinQueue(userId: string, wagerAmount: number, skillRange: number): Promise<string>;
    private findMatch;
    getMatchStatus(matchId: string): Promise<Match>;
}
