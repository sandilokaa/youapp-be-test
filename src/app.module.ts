import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './storages',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/you-app-db'),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
