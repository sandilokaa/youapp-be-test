import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect('amqp://guest:guest@127.0.0.1:5672');
      this.channel = await this.connection.createChannel();
      await this.setup();
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  private async setup() {
    const exchange = 'chat_exchange';
    const queue = 'chat_queue';

    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, 'chat.message');
  }

  async publish(routingKey: string, message: any) {
    const exchange = 'chat_exchange';
    try {
      this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );
    } catch (error) {
      console.error('Failed to publish message:', error);
    }
  }

  async consume(queue: string, callback: (msg: amqp.Message) => void) {
    await this.channel.consume(queue, (msg) => {
      if (msg) {
        callback(msg);
        this.channel.ack(msg);
      }
    });
  }
}
