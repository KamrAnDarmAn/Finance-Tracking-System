import { Request } from 'express-serve-static-core'
interface UserPayload {
  userId: string;
}

// 2. Augment the global Express namespace
declare global {
  namespace Express {
    interface Request {
      user?: CustomUser; // Optional because not all routes are authenticated
    }
  }
}
