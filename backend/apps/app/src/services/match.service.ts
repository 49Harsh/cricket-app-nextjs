import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from '../schemas/match.schema';
import { CounterService } from './counter.service';
import { RedisService } from './redis.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    private counterService: CounterService,
    private redisService: RedisService,
  ) {}

  async createMatch(matchData: any): Promise<Match> {
    const matchId = await this.counterService.getNextMatchId();
    const newMatch = new this.matchModel({
      ...matchData,
      matchId,
    });
    return newMatch.save();
  }

  async getMatchById(id: string): Promise<Match | null> {
    return this.matchModel.findOne({ matchId: id }).exec();
  }

  async getAllMatches(): Promise<Match[]> {
    return this.matchModel.find().exec();
  }

  async addCommentary(id: string, commentary: any): Promise<Match> {
    const match = await this.matchModel.findOne({ matchId: id });
    
    if (!match) {
      throw new Error('Match not found');
    }
    
    match.commentary.push(commentary);
    await match.save();
    
    // Store in Redis cache
    await this.redisService.storeCommentary(id, commentary);
    
    return match;
  }

  async pauseMatch(id: string): Promise<Match | null> {
    return this.matchModel.findOneAndUpdate(
      { matchId: id },
      { isPaused: true },
      { new: true }
    ).exec();
  }

  async resumeMatch(id: string): Promise<Match | null> {
    return this.matchModel.findOneAndUpdate(
      { matchId: id },
      { isPaused: false },
      { new: true }
    ).exec();
  }
} 