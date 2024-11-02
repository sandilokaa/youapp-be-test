import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Profile extends Document {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  gender: string;

  @Prop()
  birthday: string;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop()
  image: string;

  @Prop({ type: [String], default: [] })
  interest: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
