import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from '../database/schema/chat.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CustomPassportStrategy } from '../../../auth/src/modules/passport.strategy';
import { AuthHelper } from '../../../auth/src/helpers/auth.helper';
import { RabbitMQModule } from '../../../rabbitmq/src/modules/rabbitmq.module';
import { AuthModule } from '../../../auth/src/modules/auth.module';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../../../user/src/modules/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RabbitMQModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRESIN') },
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, AuthHelper, CustomPassportStrategy, ChatGateway],
})
export class ChatModule {}
