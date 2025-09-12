
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PlanetDocument = HydratedDocument<Planet>;

@Schema()
export class Planet {
  @Prop()
  name: string;
  @Prop()
  size: number;

  @Prop()
  top: number;
  @Prop()
  left: number;
  @Prop()
  ingamePosition: string;
  @Prop()
  pic: string;

  @Prop()
  description: string;

  @Prop({type:[{type:Types.ObjectId,ref:'Legion'}]})
  legions: Types.ObjectId[];

  @Prop({type:[{type:Types.ObjectId,ref:'Event'}]})
  events: Types.ObjectId[];


}

export const PlanetSchema = SchemaFactory.createForClass(Planet);


