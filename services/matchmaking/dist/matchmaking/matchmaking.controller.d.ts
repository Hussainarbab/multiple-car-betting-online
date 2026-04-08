import { MatchmakingService } from './matchmaking.service';
export declare class MatchmakingController {
    private readonly matchmakingService;
    constructor(matchmakingService: MatchmakingService);
    joinQueue(body: {
        userId: string;
        wagerAmount: number;
        skillRange: number;
    }): Promise<{
        matchId: string;
    }>;
    getMatchStatus(matchId: string): Promise<import("./match.entity").Match>;
}
