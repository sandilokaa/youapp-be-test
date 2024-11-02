import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UserLoginDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  username?: string;

  @IsOptional()
  @ApiProperty({ type: 'string' })
  @IsEmail()
  email?: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  password: string;
}
