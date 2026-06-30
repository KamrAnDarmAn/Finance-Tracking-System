import { Request, Response } from "express-serve-static-core";

export type GraphQLContext = {
  req: Request;
  res: Response;
  session: () => Promise<{ userId: string } | null>;
};
