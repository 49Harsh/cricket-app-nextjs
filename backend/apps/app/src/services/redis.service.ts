import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import * as Redis from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis.RedisClientType;
  private logger = new Logger(RedisService.name);
  private isConnected = false;

  async onModuleInit() {
    try {
      this.client = Redis.createClient({
        url: 'redis://localhost:6379',
        socket: {
          reconnectStrategy: false // Disable reconnection attempts
        }
      });

      this.client.on('error', (err) => {
        if (!this.isConnected) {
          // Only log the error once
          this.logger.warn(`Redis client error: ${err.message}`);
          this.logger.warn('Redis is not available. Some features will be limited.');
        }
        this.isConnected = false;
      });

      // Try to connect once
      await this.client.connect().catch(error => {
        this.logger.warn(`Could not connect to Redis: ${error.message}`);
        this.logger.warn('Continuing without Redis - caching features will be disabled');
        this.isConnected = false;
      });
      
      if (this.client.isOpen) {
        this.isConnected = true;
        this.logger.log('Connected to Redis server');
      }
    } catch (error) {
      this.logger.warn(`Redis initialization error: ${error.message}`);
      this.logger.warn('Continuing without Redis - caching features will be disabled');
      this.isConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.isConnected && this.client.isOpen) {
      await this.client.disconnect();
      this.logger.log('Disconnected from Redis server');
    }
  }

  async storeCommentary(matchId: string, commentary: any) {
    if (!this.isConnected || !this.client.isOpen) {
      return; // Skip Redis operations if not connected
    }
    
    try {
      const key = `match:${matchId}:commentary`;
      await this.client.lPush(key, JSON.stringify(commentary));
      await this.client.lTrim(key, 0, 9); // Keep only the latest 10 entries
    } catch (error) {
      this.logger.warn(`Redis operation failed: ${error.message}`);
    }
  }

  async getLatestCommentary(matchId: string): Promise<any[]> {
    if (!this.isConnected || !this.client.isOpen) {
      return []; // Return empty array if Redis is not available
    }
    
    try {
      const key = `match:${matchId}:commentary`;
      const data = await this.client.lRange(key, 0, 9);
      return data.map(item => JSON.parse(item));
    } catch (error) {
      this.logger.warn(`Redis operation failed: ${error.message}`);
      return [];
    }
  }
} 