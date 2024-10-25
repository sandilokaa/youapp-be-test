declare module 'passport-jwt' {
  import { Strategy } from 'passport-strategy';

  export interface JwtFromRequestFunction {
    (req: any): string | null;
  }

  export interface JwtOptions {
    jwtFromRequest?: JwtFromRequestFunction | any;
    secretOrKey: string;
    // Tambahkan opsi lain yang kamu perlukan
  }

  export class Strategy extends Strategy {
    constructor(
      options: JwtOptions,
      verify: (payload: any, done: (err: any, user?: any) => void) => void,
    );
    // Tambahkan metode lain jika diperlukan
  }

  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken(): JwtFromRequestFunction;
    // Tambahkan metode lain jika diperlukan
  };
}
