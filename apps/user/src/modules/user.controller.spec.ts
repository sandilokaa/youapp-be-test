import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-user.dto';
import { Request } from 'express';

jest.mock('../../../auth/src/modules/guards/jwt-auth.guard');

describe('User Controller', () => {
  let userController: UserController;

  const mockUserService = {
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
