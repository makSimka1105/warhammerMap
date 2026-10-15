import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop({ type: [String], default: [] })
  shots: string[];
  @Prop()
  link: string;

  @Prop({ type: Types.ObjectId, ref: 'Planet', required: true, index: true })
  place: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
