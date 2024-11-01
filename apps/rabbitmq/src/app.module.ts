import { Module } from '@nestjs/common';
import { RabbitMQModule } from './modules/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
})
export class AppModule {}
