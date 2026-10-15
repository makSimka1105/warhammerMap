import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PlanetDocument = HydratedDocument<Planet>;

@Schema({ timestamps: true })
export class Planet {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  top: number;
  @Prop({ required: true })
  left: number;
  @Prop()
  ingamePosition: string;
  @Prop({ required: true })
  pic: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Legion' }], default: [] })
  legions: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Event' }], default: [] })
  events: Types.ObjectId[];
}

export const PlanetSchema = SchemaFactory.createForClass(Planet);
