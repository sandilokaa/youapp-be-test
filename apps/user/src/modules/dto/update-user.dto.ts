import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  gender?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  birthday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  horoscope?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  zodiac?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  height?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string' })
  weight?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', format: 'binary' })
  image?: Express.Multer.File;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  interest?: string[];
}
