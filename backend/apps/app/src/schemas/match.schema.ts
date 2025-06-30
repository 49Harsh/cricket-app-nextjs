import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

export enum EventType {
  RUN = 'run',
  WICKET = 'wicket',
  WIDE = 'wide',
  NO_BALL = 'no_ball',
  BYE = 'bye',
  LEG_BYE = 'leg_bye',
}

@Schema()
export class Commentary {
  @Prop({ required: true })
  over!: number;

  @Prop({ required: true })
  ball!: number;

  @Prop({ required: true, enum: EventType })
  eventType!: EventType;

  @Prop()
  runs?: number;

  @Prop()
  batsman?: string;

  @Prop()
  bowler?: string;

  @Prop()
  description?: string;

  @Prop({ default: Date.now })
  timestamp!: Date;
}

@Schema()
export class Match {
  @Prop({ unique: true })
  matchId!: string;

  @Prop({ required: true })
  team1!: string;

  @Prop({ required: true })
  team2!: string;

  @Prop({ required: true })
  venue!: string;

  @Prop({ default: Date.now })
  startTime!: Date;

  @Prop({ default: false })
  isPaused!: boolean;

  @Prop({ type: [Object], default: [] })
  commentary!: Commentary[];
}

export const MatchSchema = SchemaFactory.createForClass(Match); 