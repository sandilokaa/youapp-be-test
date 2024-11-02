import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schema/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from '../helpers/auth.helper';
import { CustomPassportStrategy } from './passport.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRESIN') },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    CustomPassportStrategy,
    JwtAuthGuard,
    Reflector,
  ],
  exports: [
    AuthService,
    AuthHelper,
    CustomPassportStrategy,
    MongooseModule,
    JwtModule,
    ConfigModule,
    JwtAuthGuard,
    Reflector,
  ],
})
export class AuthModule {}
