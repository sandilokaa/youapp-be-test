import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../database/schema/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NoUserFoundError } from '../errors/ResourceError';
import { UpdateProfileDto } from './dto/update-user.dto';
import { AuthHelper } from '../../../auth/src/helpers/auth.helper';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

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
        const oldImagePath = path.resolve(__dirname, '..', '..', user.image);
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
