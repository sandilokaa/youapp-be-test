import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './modules/chat.module';
import { AuthModule } from '@auth/modules/auth.module';
import { UserModule } from '@user/modules/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    ChatModule,
  ],
})
export class AppModule {}
