import { IsString } from 'class-validator';

export class PublishMessageDto {
  @IsString()
  content: string;

  @IsString()
  userId: string;
}
