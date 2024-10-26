import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-user.dto';
import { Request } from 'express';

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
  @Put('/updateProfile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() options: UpdateProfileDto,
    @Req() req: Request,
  ) {
    const userId = String(req.user._id);
    const data = await this.userService.updateProfile(id, options, userId);
    return { data: data };
  }
}
