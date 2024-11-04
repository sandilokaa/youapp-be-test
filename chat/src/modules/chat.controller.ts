import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '@auth/modules/guards/jwt-auth.guard';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Req() req: Request,
  ) {
    const userId = String(req.user._id);
    await this.chatService.sendMessage(sendMessageDto, userId);
    return { message: 'Message sent successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('recentMessages')
  async getRecentMessages(@Req() req: Request) {
    const userId = String(req.user._id);
    const recentMessages = await this.chatService.getRecentMessages(userId);
    return { data: recentMessages };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('viewMessages')
  async viewMessages(
    @Query('receiverId') receiverId: string,
    @Req() req: Request,
  ) {
    const userId = String(req.user._id);
    const data = await this.chatService.viewMessages(userId, receiverId);
    return { data: data };
  }
}
