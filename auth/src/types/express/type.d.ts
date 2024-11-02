import { User } from 'src/database/schema/user.schema';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
