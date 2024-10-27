import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import path from 'path';
import fs from 'fs';

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
    file: Express.Multer.File,
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

    if (options.interest) {
      user.interest = [...new Set([...user.interest, ...options.interest])];
    }

    this.handleUploadImage(user, file);

    await user.save();

    return user;
  }

  private handleUploadImage(user: User, file: Express.Multer.File): void {
    if (file) {
      if (user.image) {
        const oldImagePath = path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          user.image,
        );
        try {
          fs.unlinkSync(oldImagePath);
          console.log(`Deleted old image: ${oldImagePath}`);
        } catch (err) {
          console.error(`Failed to delete old image: ${err.message}`);
        }
      }

      const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type');
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new BadRequestException('file is too large!');
      }

      user.image = file.path;
    }
  }
}
