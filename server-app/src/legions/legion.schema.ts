import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LegionDocument = HydratedDocument<Legion>;

@Schema()
export class Legion {

  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  icon: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Planet' }] })
  planets: Types.ObjectId[];
  

}

export const LegionSchema = SchemaFactory.createForClass(Legion);
