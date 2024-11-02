import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthLogin } from './dto/login-payload.dto';

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
}
