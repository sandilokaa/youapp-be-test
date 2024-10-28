import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { Request } from 'express';

@Controller()
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Body() body: { recipientId: string; message: string },
    @Req() req: Request,
  ) {
    const senderId = String(req.user._id);
    await this.rabbitMQService.sendMessage(
      senderId,
      body.recipientId,
      body.message,
    );
    return { status: 'Message sent' };
  }
}
