import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';

@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Post('join')
  async joinQueue(
    @Body() body: { userId: string; wagerAmount: number; skillRange: number },
  ) {
    const matchId = await this.matchmakingService.joinQueue(
      body.userId,
      body.wagerAmount,
      body.skillRange,
    );
    return { matchId };
  }

  @Get('status/:matchId')
  async getMatchStatus(@Param('matchId') matchId: string) {
    return this.matchmakingService.getMatchStatus(matchId);
  }
}