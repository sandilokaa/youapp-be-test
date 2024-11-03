import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', required: false, nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', required: false, nullable: true })
  gender?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', required: false, nullable: true })
  birthday?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', required: false, nullable: true })
  horoscope?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', required: false, nullable: true })
  zodiac?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', required: false, nullable: true })
  height?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', required: false, nullable: true })
  weight?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    nullable: true,
  })
  image?: Express.Multer.File;

  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ type: [String], required: false, nullable: true })
  interest?: string[];
}
