import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';

jest.mock('../../../auth/src/modules/guards/jwt-auth.guard');

describe('User Controller', () => {
  let userController: UserController;

  const mockUserService = {
    updateProfile: jest.fn(),
    getProfile: jest.fn(),
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

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = {
        user: { _id: 'userId' },
      } as Request;

      const result = {
        name: 'Sandilokaa',
        username: 'sandilokaa',
        birthday: '1990-01-01',
        gender: 'male',
        horoscope: 'Aries',
        zodiac: 'aries',
        height: 180,
        weight: 75,
        image: 'storages/1730016811142-3x4.jpeg',
        interest: [],
      };

      mockUserService.getProfile.mockResolvedValue(result);

      expect(await userController.getProfile(req)).toEqual({
        data: result,
      });

      expect(mockUserService.getProfile).toHaveBeenCalledWith({ id: 'userId' });
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
