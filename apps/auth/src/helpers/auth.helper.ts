import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/schema/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NoUserFoundError } from '../errors/ResourceError';

@Injectable()
export class AuthHelper {
  private readonly jwt: JwtService;

  constructor(
    jwt: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.jwt = jwt;
  }

  // Decoding the JWT
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  public async validateUser(payload: any): Promise<User | null> {
    if (!payload?.id) {
      return null;
    }

    const user: User | null = await this.userModel
      .findOne({
        _id: Types.ObjectId.createFromHexString(payload.id),
      })
      .exec();

    return user;
  }

  // Generate JWT
  public async generateToken(body: {
    [key: string]: string | number;
  }): Promise<string> {
    return this.jwt.signAsync(body);
  }

  // Validate JWT
  public async validate(token: string): Promise<boolean | null> {
    const decoded: any = this.jwt.verify(token);

    if (!decoded?.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: User = await this.validateUser({ id: decoded.id });

    if (!user) {
      NoUserFoundError();
    }

    return true;
  }
}
