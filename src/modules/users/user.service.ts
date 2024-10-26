import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from 'src/helpers/password.helper';
import {
  NoUserFoundError,
  UserAlreadyExistsError,
} from 'src/errors/ResourceError';
import { RegisterUserDto } from './dto/user-register.dto';
import { UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
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

    return createdUser.save();
  }

  // Update Profile
  async updateProfile(
    id: string,
    options: UpdateProfileDto,
    userId: string,
  ): Promise<User> {
    if (id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });

    if (!user) {
      NoUserFoundError();
    }

    user.name = options.name ? options.name : user.name;
    user.gender = options.gender ? options.gender : user.gender;
    user.birthday = options.birthday ? options.birthday : user.birthday;
    user.horoscope = options.horoscope ? options.horoscope : user.horoscope;
    user.zodiac = options.zodiac ? options.zodiac : user.zodiac;
    user.height = options.height ? options.height : user.height;
    user.weight = options.weight ? options.weight : user.weight;

    await user.save();

    return user;
  }
}
