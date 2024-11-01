import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schema/user.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomPassportStrategy } from '../../../auth/src/modules/passport.strategy';
import { AuthHelper } from '../../../auth/src/helpers/auth.helper';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRESIN') },
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './storages',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AuthHelper, CustomPassportStrategy],
})
export class UserModule {}
