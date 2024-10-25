import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthLogin } from './dto/login-payload.dto';
import { Public } from 'src/decorators/public.decorator';
import { JwtAuthGuard } from './auth.guard';
import { Request } from 'express';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

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

  @UseGuards(JwtAuthGuard)
  @Get('/getProfile')
  async getProfile(@Req() req: Request) {
    const self = await this.authService.getProfile({
      id: String(req.user._id),
    });

    return { data: self };
  }
}
