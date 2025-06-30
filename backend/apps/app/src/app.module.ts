import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchController } from './controllers/match.controller';
import { MatchService } from './services/match.service';
import { CounterService } from './services/counter.service';
import { RedisService } from './services/redis.service';
import { MatchGateway } from './gateways/match.gateway';
import { Match, MatchSchema } from './schemas/match.schema';
import { Counter, CounterSchema } from './schemas/counter.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/cricket-app'),
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [AppController, MatchController],
  providers: [AppService, MatchService, CounterService, RedisService, MatchGateway],
})
export class AppModule {}
