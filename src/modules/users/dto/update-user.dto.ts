import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  gender?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  birthday?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  horoscope?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  zodiac?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  height?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  weight?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image?: string;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  interest?: string[];
}
