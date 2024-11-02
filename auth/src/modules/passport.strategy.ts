import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from '../helpers/auth.helper';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class CustomPassportStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly helper: AuthHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: true,
    });
  }

  public async validate(payload: any): Promise<any> {
    const user = await this.helper.validateUser({ id: payload.id });
    if (!user) {
      console.log('User not found for payload:', payload);
    }
    return user;
  }
}
