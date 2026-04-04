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
exports.MatchmakingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const match_entity_1 = require("./match.entity");
const ioredis_1 = require("ioredis");
let MatchmakingService = class MatchmakingService {
    constructor(matchRepository) {
        this.matchRepository = matchRepository;
        this.redis = new ioredis_1.Redis();
    }
    async joinQueue(userId, wagerAmount, skillRange) {
        const queueKey = `queue:skill:${Math.floor(skillRange / 100) * 100}`;
        await this.redis.zadd(queueKey, Date.now(), `${userId}:${wagerAmount}`);
        return this.findMatch(userId, wagerAmount, skillRange);
    }
    async findMatch(userId, wagerAmount, skillRange) {
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
                    trackId: 'default-track',
                });
                const savedMatch = await this.matchRepository.save(match);
                return savedMatch.id;
            }
        }
        return null;
    }
    async getMatchStatus(matchId) {
        return this.matchRepository.findOne({ where: { id: matchId } });
    }
};
exports.MatchmakingService = MatchmakingService;
exports.MatchmakingService = MatchmakingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MatchmakingService);
//# sourceMappingURL=matchmaking.service.js.map