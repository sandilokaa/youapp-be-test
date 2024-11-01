import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { PublishMessageDto } from './dto/publish-message.dto';

@Controller()
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('sendRabbit')
  async sendMessage(@Body() publishMessageDto: PublishMessageDto) {
    try {
      await this.rabbitMQService.publish('chat.message', publishMessageDto);
      return { message: 'Message sent to RabbitMQ' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Message not sent',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
