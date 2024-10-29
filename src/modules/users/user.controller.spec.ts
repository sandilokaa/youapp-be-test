import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { Request } from 'express';

jest.mock('../auth/auth.guard');

describe('User Controller', () => {
  let userController: UserController;

  const mockUserService = {
    register: jest.fn(),
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
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

      mockUserService.register.mockResolvedValue(result);

      expect(await userController.register(registerUserDto)).toEqual({
        data: result,
      });

      expect(mockUserService.register).toHaveBeenCalledWith(registerUserDto);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile and return the updated data', async () => {
      const req = {
        user: { _id: 'userId' },
      } as Request;

      const updateProfileDto: UpdateProfileDto = {
        name: 'Sandi Loka',
      };

      const mockImage = {
        originalName: 'testImage.jpg',
        buffer: Buffer.from('file content'),
      } as unknown as Express.Multer.File;

      const result = {
        name: 'Sandi Loka',
        image: 'newImagePath',
      };

      mockUserService.updateProfile.mockResolvedValue(result);

      const response = await userController.updateProfile(
        'userId',
        updateProfileDto,
        req,
        mockImage,
      );

      expect(response).toEqual({ data: result });
      expect(mockUserService.updateProfile).toHaveBeenCalledWith(
        'userId',
        updateProfileDto,
        String(req.user._id),
        mockImage,
      );
    });
  });
});
