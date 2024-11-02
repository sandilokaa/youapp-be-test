import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NoUserFoundError } from '../errors/ResourceError';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '../database/schema/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import * as path from 'path';
import * as fs from 'fs';
import { SelfRequestDto, SelfUser } from './dto/self-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
  ) {}

  // Create Profile
  async createProfile(profileData: CreateProfileDto): Promise<Profile> {
    const newProfile = new this.profileModel(profileData);
    return await newProfile.save();
  }

  // Get Profile
  public async getProfile(self: SelfRequestDto): Promise<SelfUser> {
    const user = await this.profileModel.findOne({
      userId: self.id,
    });

    if (!user) {
      NoUserFoundError();
    }

    const selfUser = new SelfUser();
    selfUser.name = user.name;
    selfUser.username = user.username;
    selfUser.birthday = user.birthday;
    selfUser.gender = user.gender;
    selfUser.horoscope = user.horoscope;
    selfUser.zodiac = user.zodiac;
    selfUser.height = user.height;
    selfUser.weight = user.weight;
    selfUser.image = user.image;
    selfUser.interest = user.interest;

    return selfUser;
  }

  // Update Profile
  async updateProfile(
    id: string,
    options: UpdateProfileDto,
    userId: string,
    file: Express.Multer.File,
  ): Promise<Profile> {
    if (id !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const profile = await this.profileModel.findOne({
      userId: userId,
    });

    if (!profile) {
      NoUserFoundError();
    }

    profile.name = options.name ? options.name : profile.name;
    profile.gender = options.gender ? options.gender : profile.gender;
    profile.birthday = options.birthday ? options.birthday : profile.birthday;
    profile.horoscope = options.horoscope
      ? options.horoscope
      : profile.horoscope;
    profile.zodiac = options.zodiac ? options.zodiac : profile.zodiac;
    profile.height = options.height ? options.height : profile.height;
    profile.weight = options.weight ? options.weight : profile.weight;

    if (options.interest) {
      profile.interest = [
        ...new Set([...profile.interest, ...options.interest]),
      ];
    }

    this.handleUploadImage(profile, file);

    await profile.save();

    return profile;
  }

  private handleUploadImage(profile: Profile, file: Express.Multer.File): void {
    if (file) {
      if (profile.image) {
        const oldImagePath = path.resolve(__dirname, '..', '..', profile.image);
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

      profile.image = file.path;
    }
  }
}
