import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as Redis from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis.RedisClientType;

  async onModuleInit() {
    this.client = Redis.createClient({
      url: 'redis://localhost:6379',
    });
    
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async storeCommentary(matchId: string, commentary: any) {
    const key = `match:${matchId}:commentary`;
    await this.client.lPush(key, JSON.stringify(commentary));
    await this.client.lTrim(key, 0, 9); // Keep only the latest 10 entries
  }

  async getLatestCommentary(matchId: string): Promise<any[]> {
    const key = `match:${matchId}:commentary`;
    const data = await this.client.lRange(key, 0, 9);
    return data.map(item => JSON.parse(item));
  }
} 