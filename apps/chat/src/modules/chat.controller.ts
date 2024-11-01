import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/src/modules/guards/jwt-auth.guard';

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
}
