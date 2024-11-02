import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthLogin } from './dto/login-payload.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register
  @Post('register')
  async register(@Body() options: RegisterUserDto) {
    const user = await this.authService.register(options);
    return { data: user };
  }

  // Login
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AuthLogin,
    description: 'User info with access token',
  })
  async login(@Body() userLoginDto: UserLoginDto) {
    const login = await this.authService.login(userLoginDto);

    return { data: login };
  }

  // Get Profile
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/getProfile')
  async getProfile(@Req() req: Request) {
    const self = await this.authService.getProfile({
      id: String(req.user._id),
    });

    return { data: self };
  }
}
