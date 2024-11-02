import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Request } from 'express';

jest.mock('../../../auth/src/modules/guards/jwt-auth.guard');

describe('ChatController', () => {
  let chatController: ChatController;

  const mockChatService = {
    sendMessage: jest.fn(),
    viewMessages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
  });

  describe('sendMessage', () => {
    it('should send message from sender to receiver', async () => {
      const req = {
        user: { _id: 'userId' },
      } as Request;

      const sendMessageDto: SendMessageDto = {
        content: 'Haloo saya sandiloka',
        receiverId: 'receiverId',
      };

      const result = {
        userId: req,
        receiverId: 'receiverId',
        content: 'Haloo saya sandiloka',
      };

      mockChatService.sendMessage.mockResolvedValue(result);

      const response = await chatController.sendMessage(sendMessageDto, req);

      expect(response).toEqual({ message: 'Message sent successfully' });

      expect(mockChatService.sendMessage).toHaveBeenCalledWith(
        sendMessageDto,
        String(req.user._id),
      );
    });
  });

  describe('viewMessages', () => {
    it('should return message history from sender to receiver', async () => {
      const req = {
        user: { _id: 'userId' },
      } as Request;

      const receiverId = 'receiverId';

      const result = [
        {
          userId: 'userId',
          content: 'Haloo',
          receiverId: 'receiverId',
        },
      ];

      mockChatService.viewMessages.mockResolvedValue(result);

      const response = await chatController.viewMessages(receiverId, req);

      expect(response).toEqual({ data: result });
      expect(mockChatService.viewMessages).toHaveBeenCalledWith(
        String(req.user._id),
        receiverId,
      );
    });
  });
});
