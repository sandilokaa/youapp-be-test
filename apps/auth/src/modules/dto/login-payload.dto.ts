import { ApiProperty } from '@nestjs/swagger';

export class AuthLogin {
  @ApiProperty()
  ownerUser: string;

  @ApiProperty()
  accessToken: string;
}
