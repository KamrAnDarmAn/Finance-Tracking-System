import { User } from "@/entities/users.entity.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
