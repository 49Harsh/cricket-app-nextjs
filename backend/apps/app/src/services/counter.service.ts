import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from '../schemas/counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name)
    private readonly counterModel: Model<CounterDocument>,
  ) {}

  async getNextMatchId(): Promise<string> {
    const counter = await this.counterModel.findOneAndUpdate(
      { id: 'matchId' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );
    
    return counter.seq.toString().padStart(4, '0');
  }
} 