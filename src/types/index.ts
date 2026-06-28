import { Request, Response } from "express-serve-static-core";

export type GraphQLContext = {
  req: Request;
  res: Response;
  health: () => string;
};
