import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LegionDocument = HydratedDocument<Legion>;

@Schema({ timestamps: true })
export class Legion {
  @Prop({ required: true })
  name: string;
  @Prop()
  description: string;
  @Prop({ required: true })
  icon: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Planet' }], default: [] })
  planets: Types.ObjectId[];
}

export const LegionSchema = SchemaFactory.createForClass(Legion);
