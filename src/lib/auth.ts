import jwt from "jsonwebtoken";
import { GraphQLContext } from "../types/index.ts";

import { db } from "./db.ts";

export const createAccessToken = async (payload: { userId: string }) => {
  return await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
};

export const createRefereshToken = async (payload: { userId: string }) => {
  return await jwt.sign(payload, process.env.REFERESH_TOKEN_SECRET!);
};

export const verifyAccessToken = async (token: string | undefined) => {
  if (!token) return null;
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const authChecker = async ({ context }: { context: GraphQLContext }) => {
  try {
    const token = context.req.headers["authorization"]?.split(" ")[1];
    if (!token) return false;

    const decode = (await verifyAccessToken(token)) as { userId: string };
    const user = await db.user.findOneBy({ id: decode.userId });
    context.req.user = user;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
