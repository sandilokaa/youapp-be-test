import { User } from 'src/database/schemas/user.schema';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
