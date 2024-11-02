import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../auth/src/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
