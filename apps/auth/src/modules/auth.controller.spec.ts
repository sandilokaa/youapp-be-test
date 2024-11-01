/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { RegisterUserDto } from './dto/user-register.dto';
import { Request } from 'express';

jest.mock('./guards/jwt-auth.guard');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should return user info after register', async () => {
      const registerUserDto: RegisterUserDto = {
        username: 'sandilokaa',
        email: 'sandi@gmail.com',
        password: 'sandi123',
      };

      const result = {
        username: 'sandilokaa',
        email: 'sandi@gmail.com',
        password: 'hashedpassword',
      };

      mockAuthService.register.mockResolvedValue(result);

      expect(await authController.register(registerUserDto)).toEqual({
        data: result,
      });

      expect(mockAuthService.register).toHaveBeenCalledWith(registerUserDto);
    });
  });

  describe('login', () => {
    it('should return user info with access token', async () => {
      const userLoginDto: UserLoginDto = {
        username: 'sandilokaa',
        password: 'sandi123',
      };
      const result = { user: { username: 'sandilokaa' }, accessToken: 'token' };

      mockAuthService.login.mockResolvedValue(result);

      expect(await authController.login(userLoginDto)).toEqual({
        data: result,
      });

      expect(mockAuthService.login).toHaveBeenCalledWith(userLoginDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = {
        user: { _id: 'userId' },
      } as Request;

      const result = {
        name: 'Sandilokaa',
        username: 'sandilokaa',
        email: 'sandilokaa@example.com',
        birthday: '1990-01-01',
        gender: 'male',
        horoscope: 'Aries',
        zodiac: 'aries',
        height: 180,
        weight: 75,
        image: 'storages/1730016811142-3x4.jpeg',
        interest: [],
      };

      mockAuthService.getProfile.mockResolvedValue(result);

      expect(await authController.getProfile(req)).toEqual({
        data: result,
      });

      expect(mockAuthService.getProfile).toHaveBeenCalledWith({ id: 'userId' });
    });
  });
});
