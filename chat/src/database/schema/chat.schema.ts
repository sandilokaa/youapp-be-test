import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Chat extends Document {
  @Prop()
  userId: string;

  @Prop()
  receiverId: string;

  @Prop()
  content: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
