import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {

  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  shots: string[];
  @Prop()
  link: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Planet' }] })
  place: Types.ObjectId;


}
export const EventSchema = SchemaFactory.createForClass(Event);

