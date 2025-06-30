import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { MatchService } from '../services/match.service';
import { Match } from '../schemas/match.schema';
import { MatchGateway } from '../gateways/match.gateway';

@Controller('matches')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly matchGateway: MatchGateway,
  ) {}

  @Post('start')
  async startMatch(@Body() matchData: any): Promise<Match> {
    try {
      const match = await this.matchService.createMatch(matchData);
      return match;
    } catch (error) {
      throw new HttpException('Failed to start match', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllMatches(): Promise<Match[]> {
    return this.matchService.getAllMatches();
  }

  @Get(':id')
  async getMatchById(@Param('id') id: string): Promise<Match> {
    const match = await this.matchService.getMatchById(id);
    
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }
    
    return match;
  }

  @Post(':id/commentary')
  async addCommentary(@Param('id') id: string, @Body() commentary: any): Promise<Match> {
    try {
      const updatedMatch = await this.matchService.addCommentary(id, commentary);
      this.matchGateway.emitCommentaryUpdate(id, commentary);
      this.matchGateway.emitMatchUpdate(id, updatedMatch);
      return updatedMatch;
    } catch (error) {
      throw new HttpException('Failed to add commentary', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/pause')
  async pauseMatch(@Param('id') id: string): Promise<Match> {
    const match = await this.matchService.pauseMatch(id);
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }
    this.matchGateway.emitMatchUpdate(id, match);
    return match;
  }

  @Post(':id/resume')
  async resumeMatch(@Param('id') id: string): Promise<Match> {
    const match = await this.matchService.resumeMatch(id);
    if (!match) {
      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }
    this.matchGateway.emitMatchUpdate(id, match);
    return match;
  }
} 