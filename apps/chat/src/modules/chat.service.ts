import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { Chat } from '../database/schema/chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMQService } from '../../../rabbitmq/src/modules/rabbitmq.service';
import { AuthHelper } from '../../../auth/src/helpers/auth.helper';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService implements OnModuleInit {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly rabbitMQService: RabbitMQService,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  async onModuleInit() {
    await this.listenForMessages();
  }

  async sendMessage(sendMessageDto: SendMessageDto, userId: string) {
    const message = {
      content: sendMessageDto.content,
      userId: userId,
      receiverId: sendMessageDto.receiverId,
    };

    try {
      await this.rabbitMQService.publish('chat.message', message);
    } catch (error) {
      console.error('Failed to publish message:', error);
    }
  }

  private async listenForMessages() {
    await this.rabbitMQService.consume('chat_queue', async (msg) => {
      const messageContent = JSON.parse(msg.content.toString());
      const newMessage = new this.chatModel(messageContent);
      this.chatGateway.sendNewMessage(newMessage);
      await newMessage.save();
    });
  }

  async viewMessages(userId: string, receiverId: string) {
    return await this.chatModel
      .find({
        $or: [
          { userId, receiverId },
          { userId: receiverId, receiverId: userId },
        ],
      })
      .sort({ createdAt: 'asc' });
  }
}
