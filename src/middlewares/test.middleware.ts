import { GraphQLContext } from "@/types/index.ts";
import { NextFunction } from "express";
import { MiddlewareFn } from "type-graphql";

export const testMiddlware: MiddlewareFn<GraphQLContext> = async (
  { context },
  next: NextFunction,
) => {
  const hello = context.req.headers["hello-world"];
  if (hello) return next();
  context.res.json({ message: "something went wrong!!!" });
};
