import { db } from "@/lib/db.ts";
import { GraphQLContext } from "@/types/index.ts";
import jwt from 'jsonwebtoken'
import { MiddlewareFn } from "type-graphql";

export const protectedUser: MiddlewareFn<GraphQLContext> = async ({ context: { req, res } }, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token)
    return

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: string }

    if (!decode) {
      return
    }
    const userId = decode.userId;
    const user = await db.user.findOneBy({ id: userId });
    if (!user) {
      return;
    }

    req.user = user;
  } catch (error) {

    console.log(error);

  }

}
