import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './modules/chat.module';
import { AuthModule } from '../../auth/src/modules/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    ChatModule,
  ],
})
export class AppModule {}
