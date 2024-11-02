import {
  Controller,
  Body,
  UseGuards,
  Put,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-user.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/src/modules/guards/jwt-auth.guard';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

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
