import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/schema/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword, validateHash } from '../helpers/password.helper';
import {
  NoUserFoundError,
  UserAlreadyExistsError,
  WrongPasswordError,
} from '../errors/ResourceError';
import { RegisterUserDto } from './dto/user-register.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { TokenType } from '../types/enum/token-type';
import { AuthLogin } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthHelper } from '../helpers/auth.helper';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly httpService: HttpService,
    @Inject(AuthHelper) private readonly helper: AuthHelper,
  ) {}

  // Check Duplicate Email
  private async checkDuplicateEmail(options: { email?: string }) {
    if (!options.email) {
      return;
    }

    const existingUser = await this.userModel.findOne({ email: options.email });
    if (existingUser) {
      UserAlreadyExistsError();
    }
  }

  // Register User
  async register(options: RegisterUserDto): Promise<User> {
    await this.checkDuplicateEmail({
      email: options.email,
    });
    const hashedPassword = await hashPassword(options.password);

    const createdUser = new this.userModel({
      ...options,
      password: hashedPassword,
    });

    const savedUser = await createdUser.save();

    await this.syncUserProfile(savedUser);

    return savedUser;
  }

  // Sync Profile
  async syncUserProfile(user: User): Promise<void> {
    const profileData = {
      userId: user._id.toString(),
    };

    await lastValueFrom(
      this.httpService.post(
        'http://localhost:3002/api/createProfile',
        profileData,
      ),
    );
  }

  // Validate User
  public async validateUser(validateWith: {
    id?: string;
    username?: string;
    email?: string;
  }): Promise<User | null> {
    const query: any = {};

    if (validateWith.id) {
      query._id = new Types.ObjectId(validateWith.id);
    }

    if (validateWith.username) {
      query.username = validateWith.username;
    }

    if (validateWith.email) {
      query.email = validateWith.email;
    }

    const user: User | null = await this.userModel.findOne(query).exec();
    return user;
  }

  // Login User
  public async login(body: UserLoginDto): Promise<AuthLogin> {
    const { username, email, password } = body;

    const user: User | null = await this.validateUser({
      username: username,
      email: email,
    });

    if (!user) {
      NoUserFoundError();
    }

    const isPasswordValid: boolean = await validateHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      WrongPasswordError();
    }

    const token = new TokenPayloadDto();
    token.accessToken = await this.helper.generateToken({
      id: user._id.toString(),
      type: TokenType.ACCESS_TOKEN,
    });

    user.accessToken = token.accessToken;
    user.save();

    const loginPayload = new AuthLogin();
    loginPayload.ownerUser = user.username;
    loginPayload.accessToken = token.accessToken;

    return loginPayload;
  }
}
