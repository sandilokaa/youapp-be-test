import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendMessage(senderId: string, recipientId: string, message: string) {
    const payload = {
      sender: senderId,
      recipient: recipientId,
      message: message,
    };

    return this.client.emit(recipientId, payload);
  }

  @MessagePattern('*')
  handleMessage(
    @Payload() data: { senderId: string; recipientId: string; message: string },
  ) {
    console.log(`Received message from ${data.senderId}: ${data.message}`);
  }
}
