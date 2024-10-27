import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-user.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Register
  @Post('register')
  async register(@Body() options: RegisterUserDto) {
    const user = await this.userService.register(options);
    return { data: user };
  }

  // Update Profile
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
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

    console.log(file);

    return { data: data };
  }
}
