import {
  Controller,
  Body,
  UseGuards,
  Put,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  Post,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/modules/guards/jwt-auth.guard';
import { Profile } from '../database/schema/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create Profile
  @Post('createProfile')
  async createProfile(@Body() profileData: CreateProfileDto): Promise<Profile> {
    return await this.userService.createProfile(profileData);
  }

  // Get Profile
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/getProfile')
  async getProfile(@Req() req: Request) {
    const self = await this.userService.getProfile({
      id: String(req.user._id),
    });

    return { data: self };
  }

  // Update Profile
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Put('/updateProfile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() options: UpdateProfileDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = String(req.user._id);
    const data = await this.userService.updateProfile(
      id,
      options,
      userId,
      file,
    );

    return { data: data };
  }
}
