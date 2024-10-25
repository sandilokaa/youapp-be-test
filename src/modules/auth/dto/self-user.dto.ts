export class SelfUser {
  username: string;
  name: string;
  email: string;
  birthday: Date;
  gender: string;
  horoscope: string;
  zodiac: string;
  height: string;
  weight: string;
  interest: Array<{ type: string }>;
}

export class SelfRequestDto {
  id: string;
}
